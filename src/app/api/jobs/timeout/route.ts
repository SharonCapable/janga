// app/api/jobs/timeout/route.ts
//
// Called every 10 minutes by a cron job.
// Marks any job stuck in 'pending', 'booting', or 'processing'
// for over 90 minutes as 'failed' so the user can retry or delete.

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const TIMEOUT_MINUTES = 90
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization')
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cutoff = new Date(Date.now() - TIMEOUT_MINUTES * 60 * 1000)

    const stuckJobs = await prisma.generationQueue.findMany({
        where: {
            status: { in: ['pending', 'booting', 'processing'] },
            createdAt: { lt: cutoff },
        },
        select: { id: true, projectId: true },
    })

    if (stuckJobs.length === 0) {
        return NextResponse.json({ message: 'No stuck jobs', timedOut: 0 })
    }

    const stuckIds = stuckJobs.map((j) => j.id)
    const stuckProjectIds = stuckJobs.map((j) => j.projectId)

    await prisma.$transaction([
        prisma.generationQueue.updateMany({
            where: { id: { in: stuckIds } },
            data: {
                status: 'failed',
                errorMessage: `Job timed out after ${TIMEOUT_MINUTES} minutes. Please retry.`,
            },
        }),
        prisma.videoProject.updateMany({
            where: { id: { in: stuckProjectIds } },
            data: { status: 'error' },
        }),
    ])

    return NextResponse.json({
        message: `Timed out ${stuckJobs.length} job(s)`,
        timedOut: stuckJobs.length,
        jobIds: stuckIds,
    })
}

// POST alias so both Vercel Cron and manual calls work
export async function POST(request: Request) {
    return GET(request)
}