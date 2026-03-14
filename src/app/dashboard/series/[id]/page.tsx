import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/utils/prisma'
import Logo from '@/components/Logo'
import Link from 'next/link'

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
                    <Link href={`/dashboard/generate?seriesId=${series.id}`} className="px-8 py-3 bg-white text-black text-sm font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5">
                        Generate Episode
                    </Link>
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
                                <Link
                                    key={ep.id}
                                    href={`/dashboard/videos/${ep.id}`}
                                    className="p-5 glass-card border border-white/5 rounded-2xl hover:border-white/20 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                            <VideoIcon className="w-5 h-5 text-[#a1a1aa] group-hover:text-blue-400" />
                                        </div>
                                        <StatusBadge status={ep.status} />
                                    </div>
                                    <p className="font-bold text-sm line-clamp-2 mb-2">{ep.topic}</p>
                                    <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-widest">
                                        {new Date(ep.createdAt).toLocaleDateString()}
                                    </p>
                                </Link>
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

function StatusBadge({ status }: { status: string }) {
    const cls = status === 'ready' ? 'bg-emerald-500/10 text-emerald-400'
        : status === 'generating' ? 'bg-amber-500/10 text-amber-400'
            : 'bg-white/5 text-[#52525b]'

    return (
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${cls}`}>
            {status}
        </span>
    )
}

function VideoIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
}
