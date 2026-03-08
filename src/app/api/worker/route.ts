import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // Simple auth check (e.g., API Key)
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');

    if (apiKey !== process.env.WORKER_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const nextJob = await prisma.generationQueue.findFirst({
            where: { status: 'pending' },
            orderBy: { priority: 'desc' },
            include: {
                project: {
                    include: { series: true }
                }
            }
        });

        return NextResponse.json(nextJob);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');

    if (apiKey !== process.env.WORKER_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, clipUrl, finalUrl } = await request.json();

    try {
        const updatedJob = await prisma.generationQueue.update({
            where: { id },
            data: { status }
        });

        // If finished, update project status and create FinalVideo entry
        if (status === 'complete' && finalUrl) {
            const job = await prisma.generationQueue.findUnique({
                where: { id },
                select: { projectId: true }
            });

            if (job) {
                await prisma.$transaction([
                    prisma.videoProject.update({
                        where: { id: job.projectId },
                        data: { status: 'ready' }
                    }),
                    prisma.finalVideo.create({
                        data: {
                            projectId: job.projectId,
                            storageUrl: finalUrl
                        }
                    })
                ]);
            }
        }

        return NextResponse.json(updatedJob);
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
