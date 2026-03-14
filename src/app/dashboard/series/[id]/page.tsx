import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/utils/prisma'
import Logo from '@/components/Logo'
import Link from 'next/link'
import EpisodeCard from '@/components/EpisodeCard'

export default async function SeriesDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const series = await prisma.contentSeries.findUnique({
        where: { id, userId: user.id },
        include: {
            episodes: {
                orderBy: { createdAt: 'desc' },
                include: { queueItems: { take: 1 } }
            }
        }
    })

    if (!series) redirect('/dashboard')

    return (
        <div className="min-h-screen flex bg-[#09090b] text-[#fafafa]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col p-6 shrink-0 bg-[#09090b]">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Series Manager" active />
                    <SidebarLink href="/dashboard/videos" label="All Episodes" />
                    <SidebarLink href="/dashboard/settings" label="Settings" />
                </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                <Link href="/dashboard" className="text-sm text-[#a1a1aa] hover:text-white transition-colors mb-6 inline-block">
                    ← Back to manager
                </Link>

                <header className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                {series.niche}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                                {series.platform}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{series.name}</h1>
                        <p className="text-[#a1a1aa] mt-2">
                            Tone: <strong>{series.tone}</strong> • 
                            Style: <strong>{series.animationType || 'Realistic'}</strong> • 
                            Duration: <strong>{series.duration}s</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/series/${series.id}/settings`} className="px-6 py-3 border border-white/10 text-white text-sm font-bold rounded-2xl hover:bg-white/5 transition-all">
                            Series Settings
                        </Link>
                        <Link href={`/dashboard/generate?seriesId=${series.id}`} className="px-8 py-3 bg-white text-black text-sm font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5">
                            Generate Episode
                        </Link>
                    </div>
                </header>

                <section>
                    <h2 className="text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Episode History
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {series.episodes.length === 0 ? (
                            <div className="col-span-full py-20 text-center glass-card border-dashed border border-white/5">
                                <p className="text-[#52525b] text-sm italic">No episodes have been generated for this series yet.</p>
                            </div>
                        ) : (
                            series.episodes.map(ep => (
                                <EpisodeCard key={ep.id} episode={ep} />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

function SidebarLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
                background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: active ? '#fafafa' : '#a1a1aa',
            }}
        >
            {label}
        </Link>
    )
}
