import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

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

    const body = await request.json()
    const { topic, tone, duration, scheduled, frequency, timeOfDay, channelId } = body

    // Create project
    const project = await prisma.videoProject.create({
        data: {
            userId: user.id,
            topic,
            modelVersion: 'cogvideox-5b',
            duration: duration || 60,
            status: 'generating',
            channelId: channelId || null,
            scheduledPostTime: scheduled ? new Date() : null,
        },
    })

    // Add to generation queue
    await prisma.generationQueue.create({
        data: {
            projectId: project.id,
            status: 'pending',
            modelToUse: project.modelVersion,
            priority: 0,
        },
    })

    return NextResponse.json({ success: true, projectId: project.id })
}

export async function GET() {
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

    const projects = await prisma.videoProject.findMany({
        where: { userId: user.id },
        include: {
            queueItems: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
            finalVideos: {
                take: 1,
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
}
