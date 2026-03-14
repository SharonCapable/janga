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
    const { seriesId, topic, continueSeries, duration, scheduled } = body

    // 1. Fetch Series Context
    const series = await prisma.contentSeries.findUnique({
        where: { id: seriesId },
        include: {
            episodes: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    })

    if (!series) {
        return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // 2. Determine Topic with Context
    let finalTopic = topic
    let previousContext = null

    if (continueSeries && series.episodes.length > 0) {
        const lastEpisode = series.episodes[0]
        previousContext = `This is a follow-up to the previous episode titled: "${lastEpisode.topic}". Ensure continuity in style and information progression.`

        // If the user didn't provide a new topic, let the AI decide how to "Continue"
        if (!finalTopic) {
            finalTopic = `Continuation of: ${lastEpisode.topic}`
        }
    }

    // FALLBACK: If still no topic, use the series niche/name
    if (!finalTopic || finalTopic.trim() === "") {
        finalTopic = `${series.niche} Update: Episode ${series.episodes.length + 1}`
    }

    // 3. Create Video Project (Episode)
    const project = await prisma.videoProject.create({
        data: {
            userId: user.id,
            seriesId: series.id,
            topic: finalTopic,
            duration: duration || series.duration || 60,
            status: 'generating',
            channelId: series.channelId,
            scheduledPostTime: scheduled ? new Date() : null,
        },
    })

    // 4. Add to generation queue with context
    await prisma.generationQueue.create({
        data: {
            projectId: project.id,
            status: 'pending',
            modelToUse: 'cogvideox-5b',
            priority: 0,
        },
    })

    return NextResponse.json({ success: true, projectId: project.id })
}

export async function GET() {
    // ... existing GET stays the same but maybe include series name later
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
            series: true,
            queueItems: { orderBy: { createdAt: 'desc' }, take: 1 },
            finalVideos: { take: 1 }
        },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
}
