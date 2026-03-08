'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface VideoProject {
    id: string
    topic: string
    status: string
    duration: number
    createdAt: string
    queueItems: { status: string }[]
    finalVideos: { storageUrl: string }[]
}

export default function VideosPage() {
    const [projects, setProjects] = useState<VideoProject[]>([])
    const [loading, setLoading] = useState(true)

    const fetchVideos = async () => {
        const res = await fetch('/api/jobs')
        const data = await res.json()
        setProjects(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchVideos()
        const interval = setInterval(fetchVideos, 5000)
        return () => clearInterval(interval)
    }, [])

    const completedVideos = projects.filter(p =>
        p.finalVideos.length > 0 || p.queueItems[0]?.status === 'complete'
    )
    const inProgress = projects.filter(p =>
        p.queueItems[0]?.status === 'pending' || p.queueItems[0]?.status === 'processing'
    )

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r border-border flex flex-col p-6 shrink-0">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Dashboard" />
                    <SidebarLink href="/dashboard/generate" label="Generate" />
                    <SidebarLink href="/dashboard/videos" label="Videos" active />
                    <SidebarLink href="/dashboard/settings" label="Settings" />
                </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Videos</h1>
                <p className="text-text-secondary text-sm mb-10">
                    Review completed videos, approve, or regenerate.
                </p>

                {/* In progress */}
                {inProgress.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                            In progress
                        </h2>
                        <div className="flex flex-col gap-3">
                            {inProgress.map(p => (
                                <div key={p.id} className="glass-card flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{p.topic}</p>
                                        <p className="text-xs text-text-muted mt-1">{p.duration}s video</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={p.queueItems[0]?.status || 'pending'} />
                                        <ProgressIndicator status={p.queueItems[0]?.status || 'pending'} duration={p.duration} createdAt={p.createdAt} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Completed */}
                <section>
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                        Ready for review
                    </h2>
                    {loading ? (
                        <div className="glass-card p-12 text-center">
                            <p className="text-sm text-text-secondary">Loading videos...</p>
                        </div>
                    ) : completedVideos.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <p className="text-sm text-text-secondary">
                                No completed videos yet. Generate your first one.
                            </p>
                            <Link href="/dashboard/generate" className="btn-primary mt-4 inline-flex">
                                Generate video
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {completedVideos.map(p => (
                                <Link key={p.id} href={`/dashboard/videos/${p.id}`} className="glass-card hover:border-border-hover transition-colors group">
                                    {/* Video preview placeholder */}
                                    <div className="w-full aspect-[9/16] max-h-48 rounded-lg bg-surface mb-4 flex items-center justify-center overflow-hidden">
                                        {p.finalVideos[0]?.storageUrl ? (
                                            <video
                                                src={p.finalVideos[0].storageUrl}
                                                className="w-full h-full object-cover rounded-lg"
                                                muted
                                                preload="metadata"
                                            />
                                        ) : (
                                            <span className="text-xs text-text-muted">Preview unavailable</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{p.topic}</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {p.duration}s &middot; {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

function ProgressIndicator({ status, duration, createdAt }: { status: string; duration: number; createdAt: string }) {
    if (status === 'pending') {
        return <span className="text-xs text-text-muted">Queued</span>
    }

    const estimatedMs = (duration === 30 ? 20 : 40) * 60 * 1000
    const elapsed = Date.now() - new Date(createdAt).getTime()
    const pct = Math.min(Math.round((elapsed / estimatedMs) * 100), 95)
    const remaining = Math.max(0, Math.ceil((estimatedMs - elapsed) / 60000))

    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-surface overflow-hidden">
                <div
                    className="h-full rounded-full bg-secondary transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-text-muted">{remaining}m left</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const cls = status === 'pending' ? 'status-badge status-pending'
        : status === 'processing' ? 'status-badge status-processing'
            : status === 'complete' ? 'status-badge status-complete'
                : 'status-badge'
    return <span className={cls}>{status}</span>
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
