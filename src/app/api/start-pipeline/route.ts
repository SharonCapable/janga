// app/api/start-pipeline/route.ts
//
// Called by the frontend immediately after POST /api/jobs creates a project.
// 1. Starts both GCP VMs
// 2. Updates job status to 'booting' so the UI shows the right state  
// 3. Returns immediately — VM startup + job processing happen in the background
// 4. The worker's /webhook endpoint is called once the VM is reachable,
//    which triggers immediate job processing instead of waiting for polling

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID!
const GCP_ZONE = process.env.GCP_ZONE!
const GPU_VM_NAME = process.env.GPU_VM_NAME!
const ORCHESTRATOR_VM_NAME = process.env.ORCHESTRATOR_VM_NAME!
const GCP_SA_EMAIL = process.env.GCP_CLIENT_EMAIL!
const GCP_SA_KEY = process.env.GCP_SA_PRIVATE_KEY!  // base64-encoded
const GPU_SERVER_URL = process.env.GPU_SERVER_URL!
const WORKER_WEBHOOK_URL = process.env.WORKER_WEBHOOK_URL!  // http://<orchestrator-ip>:8082/webhook

// ── GCP Auth ──────────────────────────────────────────────────────────────────

async function getGCPAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000)

    const header = { alg: 'RS256', typ: 'JWT' }
    const payload = {
        iss: GCP_SA_EMAIL,
        scope: 'https://www.googleapis.com/auth/compute',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    }

    const encode = (obj: object) =>
        Buffer.from(JSON.stringify(obj)).toString('base64url')

    const unsigned = `${encode(header)}.${encode(payload)}`

    const pemKey = Buffer.from(GCP_SA_KEY, 'base64').toString('utf8')
    const keyData = pemKey
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '')

    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        Buffer.from(keyData, 'base64'),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        Buffer.from(unsigned)
    )

    const jwt = `${unsigned}.${Buffer.from(signature).toString('base64url')}`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
        throw new Error(`GCP auth failed: ${JSON.stringify(tokenData)}`)
    }
    return tokenData.access_token
}

// ── VM Control ────────────────────────────────────────────────────────────────

async function startVM(vmName: string, token: string): Promise<void> {
    try {
        const url = `https://compute.googleapis.com/compute/v1/projects/${GCP_PROJECT_ID}/zones/${GCP_ZONE}/instances/${vmName}/start`
        const res = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
            const body = await res.text()
            if (!body.includes('RUNNING') && !body.includes('already')) {
                console.warn(`Warning: Could not start VM ${vmName} via GCP API: ${body}`)
            }
        }
    } catch (err) {
        console.warn(`Warning: Network or Auth error starting VM ${vmName}:`, err)
    }
}

// ── Health Check ──────────────────────────────────────────────────────────────

async function waitForGPUServer(
    maxWaitMs = 180_000,  // 3 minutes max
    intervalMs = 10_000    // check every 10 seconds
): Promise<boolean> {
    const start = Date.now()
    while (Date.now() - start < maxWaitMs) {
        try {
            const res = await fetch(`${GPU_SERVER_URL}/health`, {
                signal: AbortSignal.timeout(5000),
            })
            if (res.ok) return true
        } catch {
            // not up yet
        }
        await new Promise((r) => setTimeout(r, intervalMs))
    }
    return false
}

// ── Background: boot VMs, then trigger webhook ────────────────────────────────

async function bootAndTrigger(queueItemId: string, projectId: string) {
    try {
        // Only attempt GCP token if the project and zone configs are actually set
        if (GCP_PROJECT_ID && GCP_ZONE) {
            try {
                const token = await getGCPAccessToken()
                await Promise.all([
                    startVM(GPU_VM_NAME, token),
                    startVM(ORCHESTRATOR_VM_NAME, token),
                ])
                console.log('VMs starting command sent.')
            } catch (authErr) {
                console.warn('GCP Auth warning (ignoring and proceeding if server is already up):', authErr)
            }
        } else {
            console.log('No GCP config found, assuming local/manual orchestration.')
        }

        console.log('Waiting for GPU server to be reachable...')
        const reachable = await waitForGPUServer()

        if (!reachable) {
            console.error('GPU server unreachable after 3 min — marking as error')
            await prisma.generationQueue.update({
                where: { id: queueItemId },
                data: { status: 'failed' },
            })
            await prisma.videoProject.update({
                where: { id: projectId },
                data: { status: 'error' },
            })
            return
        }

        // GPU server is up — ping the worker webhook to start processing immediately
        console.log('GPU server reachable. Triggering worker webhook...')
        try {
            await fetch(WORKER_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (fetchErr) {
            console.warn(`Could not reach worker webhook at ${WORKER_WEBHOOK_URL}. Defaulting to worker's polling routine.`, fetchErr)
        }

    } catch (err) {
        console.error('bootAndTrigger fatal error:', err)
        await prisma.generationQueue.update({
            where: { id: queueItemId },
            data: { status: 'failed' },
        }).catch(() => { })
        await prisma.videoProject.update({
            where: { id: projectId },
            data: { status: 'error' },
        }).catch(() => { })
    }
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await request.json()
    if (!projectId) {
        return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    // Verify ownership
    const project = await prisma.videoProject.findFirst({
        where: { id: projectId, userId: user.id },
        include: {
            queueItems: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
    })

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const queueItem = project.queueItems[0]
    if (!queueItem) {
        return NextResponse.json({ error: 'No queue item found' }, { status: 404 })
    }

    // Update status to 'booting' so UI can show the right state
    await prisma.generationQueue.update({
        where: { id: queueItem.id },
        data: { status: 'booting' },
    })

    await prisma.videoProject.update({
        where: { id: projectId },
        data: { status: 'generating' },
    })

    // Boot VMs + trigger worker in background — don't block the HTTP response
    bootAndTrigger(queueItem.id, projectId).catch(console.error)

    return NextResponse.json({
        success: true,
        status: 'booting',
        message: 'Pipeline is starting. This takes 1–2 minutes.',
    })
}