import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

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
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, niche, tone, animationType, duration, platform } = body

        const updatedSeries = await prisma.contentSeries.update({
            where: { id, userId: user.id },
            data: {
                name,
                niche,
                tone,
                animationType,
                duration: duration ? parseInt(duration) : undefined,
                platform
            }
        })

        return NextResponse.json(updatedSeries)
    } catch (error) {
        console.error('Update Series Error:', error)
        return NextResponse.json({ error: 'Failed to update series' }, { status: 500 })
    }
}

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
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.contentSeries.delete({
            where: { id, userId: user.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete Series Error:', error)
        return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 })
    }
}
