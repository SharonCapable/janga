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

    // Check onboarding
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (dbUser && !dbUser.onboarded) redirect('/onboarding')

    const [projects, channels] = await Promise.all([
        prisma.videoProject.findMany({
            where: { userId: user.id },
            include: {
                queueItems: { orderBy: { createdAt: 'desc' }, take: 1 },
                finalVideos: { take: 1 },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        }),
        supabase.from('channels').select('*').eq('user_id', user.id).then(res => res.data),
    ])

    const pendingCount = projects.filter(p => p.queueItems[0]?.status === 'pending').length
    const processingCount = projects.filter(p => p.queueItems[0]?.status === 'processing').length
    const completeCount = projects.filter(p => p.status === 'ready' || p.queueItems[0]?.status === 'complete').length

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex flex-col p-6 shrink-0">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Dashboard" active />
                    <SidebarLink href="/dashboard/generate" label="Generate" />
                    <SidebarLink href="/dashboard/videos" label="Videos" />
                    <SidebarLink href="/dashboard/settings" label="Settings" />
                </nav>

                <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-3 mb-4">
                        {user.user_metadata?.avatar_url && (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-text-muted truncate">{user.email}</p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-text-secondary text-sm mt-1">
                            Overview of your video generation pipeline.
                        </p>
                    </div>
                    <Link href="/dashboard/generate" className="btn-primary">
                        Generate now
                    </Link>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <StatCard label="Total projects" value={projects.length} />
                    <StatCard label="Pending" value={pendingCount} variant="warning" />
                    <StatCard label="Processing" value={processingCount} variant="processing" />
                    <StatCard label="Complete" value={completeCount} variant="success" />
                </div>

                {/* Queue */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">Recent activity</h2>
                    <div className="border border-border rounded-2xl overflow-hidden">
                        {projects.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-text-secondary text-sm">
                                    No projects yet. Create your first video to get started.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                                        <th className="text-left p-4 font-medium">Topic</th>
                                        <th className="text-left p-4 font-medium">Duration</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Created</th>
                                        <th className="text-right p-4 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => {
                                        const queueStatus = p.queueItems[0]?.status || p.status
                                        const hasVideo = p.finalVideos.length > 0
                                        return (
                                            <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 font-medium">{p.topic}</td>
                                                <td className="p-4 text-text-secondary">{(p as any).duration}s</td>
                                                <td className="p-4">
                                                    <StatusBadge status={queueStatus} />
                                                </td>
                                                <td className="p-4 text-text-secondary">
                                                    {new Date(p.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {hasVideo && (
                                                        <Link
                                                            href={`/dashboard/videos/${p.id}`}
                                                            className="text-primary text-xs font-medium hover:underline"
                                                        >
                                                            Review
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>

                {/* Connected channels */}
                <section className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Connected channels</h2>
                        <Link href="/dashboard/settings" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                            Manage
                        </Link>
                    </div>
                    <div className="flex gap-3">
                        {channels && channels.length > 0 ? (
                            channels.map((ch: any) => (
                                <div key={ch.id} className="glass-card flex items-center gap-3 px-5 py-3">
                                    <div className="w-2 h-2 rounded-full bg-success" />
                                    <span className="text-sm font-medium">{ch.channel_name}</span>
                                    <span className="text-xs text-text-muted capitalize">{ch.platform}</span>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card px-5 py-3">
                                <p className="text-sm text-text-secondary">No channels connected yet.</p>
                            </div>
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
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
                background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}
        >
            {label}
        </Link>
    )
}

function StatCard({ label, value, variant }: { label: string; value: number; variant?: string }) {
    const dotColor = variant === 'warning' ? 'bg-warning'
        : variant === 'processing' ? 'bg-secondary'
            : variant === 'success' ? 'bg-success'
                : 'bg-text-muted'

    return (
        <div className="glass-card">
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">{label}</p>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const cls = status === 'pending' ? 'status-badge status-pending'
        : status === 'processing' ? 'status-badge status-processing'
            : status === 'complete' || status === 'ready' ? 'status-badge status-complete'
                : status === 'failed' ? 'status-badge status-failed'
                    : 'status-badge'

    return <span className={cls}>{status}</span>
}
