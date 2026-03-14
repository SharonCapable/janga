// app/api/worker/route.ts
//
// Used exclusively by the Python worker (main.py) to:
//   GET  — fetch the next pending job
//   PATCH — update job status (processing, complete, failed)

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('apiKey')

    if (apiKey !== process.env.WORKER_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Fetch the next job that is pending OR booting
        // 'booting' means the VM was just started — pick it up as soon as worker is alive
        const nextJob = await prisma.generationQueue.findFirst({
            where: {
                status: { in: ['pending', 'booting'] },
            },
            orderBy: { priority: 'desc' },
            include: {
                project: {
                    include: { series: true }
                }
            }
        })

        return NextResponse.json(nextJob)
    } catch (error) {
        console.error('Worker GET error:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('apiKey')

    if (apiKey !== process.env.WORKER_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status, finalUrl, errorMessage } = await request.json()

    try {
        // Update the queue item
        const updatedJob = await prisma.generationQueue.update({
            where: { id },
            data: {
                status,
                ...(errorMessage ? { errorMessage } : {}),
            }
        })

        if (status === 'complete' && finalUrl) {
            // On success: mark project as ready + create FinalVideo record
            const job = await prisma.generationQueue.findUnique({
                where: { id },
                select: { projectId: true }
            })

            if (job) {
                await prisma.$transaction([
                    prisma.videoProject.update({
                        where: { id: job.projectId },
                        data: { status: 'ready' }
                    }),
                    prisma.finalVideo.create({
                        data: {
                            projectId: job.projectId,
                            storageUrl: finalUrl,
                        }
                    })
                ])
            }
        }

        if (status === 'failed') {
            // On failure: mark project with error status so UI shows retry option
            const job = await prisma.generationQueue.findUnique({
                where: { id },
                select: { projectId: true }
            })

            if (job) {
                await prisma.videoProject.update({
                    where: { id: job.projectId },
                    data: { status: 'error' }
                })
            }
        }

        return NextResponse.json(updatedJob)
    } catch (error) {
        console.error('Worker PATCH error:', error)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
}