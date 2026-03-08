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

    const { seriesName, niche, tone, duration, platform } = await request.json()

    // Create the first series for the user
    await prisma.$transaction([
        prisma.contentSeries.create({
            data: {
                userId: user.id,
                name: seriesName || `${niche} Chronicles`,
                niche,
                tone,
                duration: parseInt(duration) || 60,
                platform: platform || 'tiktok',
            }
        }),
        prisma.user.update({
            where: { id: user.id },
            data: { onboarded: true },
        })
    ])

    return NextResponse.json({ success: true })
}
