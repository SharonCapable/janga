import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/utils/prisma'
import Logo from '@/components/Logo'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check onboarding & Fetch Data
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            series: {
                include: {
                    episodes: {
                        orderBy: { createdAt: 'desc' },
                        take: 3
                    },
                    channel: true
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (dbUser && !dbUser.onboarded) redirect('/onboarding')

    const series = dbUser?.series || []
    const totalEpisodes = series.reduce((acc, s) => acc + s.episodes.length, 0)
    const activeSeriesCount = series.length

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

                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        {user.user_metadata?.avatar_url && (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full border border-white/10"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Factory</h1>
                        <p className="text-[#a1a1aa] text-sm mt-1">
                            Manage and scale your content series.
                        </p>
                    </div>
                    <Link href="/dashboard/new" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                        New Series
                    </Link>
                </header>

                {/* Main Content */}
                {series.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 glass-card rounded-3xl border-dashed border-2 border-white/5">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <PlusIcon className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Build your first series</h3>
                        <p className="text-[#a1a1aa] text-sm text-center max-w-xs mb-8">
                            Create a project with a niche and tone to start generating high-retention content.
                        </p>
                        <Link href="/dashboard/new" className="btn-primary">
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {series.map(s => (
                            <div key={s.id} className="p-8 glass-card border border-white/5 rounded-3xl hover:border-white/10 transition-all flex flex-col group">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                                {s.niche}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                                                {s.platform}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">{s.name}</h2>
                                        <p className="text-[#a1a1aa] text-sm mt-1">{s.tone} • {s.duration}s episodes</p>
                                    </div>
                                    <Link
                                        href={`/dashboard/generate?seriesId=${s.id}`}
                                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group/btn"
                                    >
                                        <PlayFillIcon className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Recent Episodes */}
                                <div className="flex-1 space-y-3">
                                    <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-widest ml-1">Recent Episodes</p>
                                    {s.episodes.length > 0 ? (
                                        s.episodes.map(ep => (
                                            <div key={ep.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <VideoIcon className="w-4 h-4 text-[#a1a1aa]" />
                                                    </div>
                                                    <span className="text-sm font-medium truncate max-w-[140px]">{ep.topic}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${ep.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                    }`}>
                                                    {ep.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                                            <p className="text-xs text-[#52525b]">No episodes generated yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-xs text-[#a1a1aa] font-medium">{s.episodes.length} Episodes</span>
                                    </div>
                                    <Link href={`/dashboard/series/${s.id}`} className="text-xs font-bold text-white/40 hover:text-white transition-colors">
                                        View Settings →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                boxShadow: active ? 'inset 0 0 10px rgba(255,255,255,0.02)' : 'none',
                border: active ? '1px border border-white/5' : '1px border border-transparent'
            }}
        >
            {label}
        </Link>
    )
}

// Icons
function PlusIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
}

function PlayFillIcon({ className }: { className?: string }) {
    return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
}

function VideoIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
}
