import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        // Delete project and all related items (clips, final videos, queue)
        // Prisma will handle relations if set to cascade, otherwise we do it manually
        await prisma.$transaction([
            prisma.generationQueue.deleteMany({ where: { projectId: id } }),
            prisma.generatedClip.deleteMany({ where: { projectId: id } }),
            prisma.finalVideo.deleteMany({ where: { projectId: id } }),
            prisma.videoProject.delete({ where: { id, userId: user.id } }),
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete Error:', error)
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action } = await request.json()

    try {
        if (action === 'retry') {
            await prisma.$transaction([
                prisma.videoProject.update({
                    where: { id, userId: user.id },
                    data: { status: 'generating' }
                }),
                prisma.generationQueue.updateMany({
                    where: { projectId: id },
                    data: { status: 'pending', retryCount: 0 }
                })
            ])
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Retry Error:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
}
