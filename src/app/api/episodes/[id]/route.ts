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
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Delete related queue items, clips, and final videos first if Cascade is not set in DB
        // Prisma will handle it if onDelete: Cascade is in the schema.
        await prisma.videoProject.delete({
            where: { id, userId: user.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete Episode Error:', error)
        return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 })
    }
}
