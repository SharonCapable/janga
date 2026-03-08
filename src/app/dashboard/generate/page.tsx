'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

const TONES = ['Cinematic', 'Educational', 'Dramatic', 'Calm', 'Mysterious', 'Inspirational']

export default function GeneratePage() {
    const router = useRouter()
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Cinematic')
    const [duration, setDuration] = useState<30 | 60>(60)
    const [mode, setMode] = useState<'instant' | 'scheduled'>('instant')
    const [frequency, setFrequency] = useState('1')
    const [timeOfDay, setTimeOfDay] = useState('18:00')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!topic.trim()) return
        setSubmitting(true)

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    tone,
                    duration,
                    scheduled: mode === 'scheduled',
                    frequency: parseInt(frequency),
                    timeOfDay,
                }),
            })
            const data = await res.json()
            if (data.success) {
                router.push('/dashboard')
            }
        } catch {
            setSubmitting(false)
        }
    }

    const clipCount = duration === 30 ? 5 : 10
    const estimatedTime = duration === 30 ? '~20 min' : '~40 min'

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex flex-col p-6 shrink-0">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Dashboard" />
                    <SidebarLink href="/dashboard/generate" label="Generate" active />
                    <SidebarLink href="/dashboard/videos" label="Videos" />
                    <SidebarLink href="/dashboard/settings" label="Settings" />
                </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto max-w-3xl">
                <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 inline-block">
                    ← Back to dashboard
                </Link>

                <h1 className="text-2xl font-bold tracking-tight mb-2">Generate video</h1>
                <p className="text-text-secondary text-sm mb-10">
                    Define your topic and preferences. The pipeline will handle the rest.
                </p>

                {/* Topic */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Topic</label>
                    <textarea
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. The untold story of ancient West African trade routes..."
                        className="w-full h-28 p-4 rounded-xl border border-border bg-surface text-text-primary text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted"
                    />
                </div>

                {/* Tone */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <div className="flex flex-wrap gap-2">
                        {TONES.map(t => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                                style={{
                                    borderColor: tone === t ? 'var(--color-primary)' : 'var(--color-border)',
                                    background: tone === t ? 'rgba(59,130,246,0.08)' : 'transparent',
                                    color: tone === t ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setDuration(30)}
                            className="p-4 rounded-xl border text-sm font-medium transition-all"
                            style={{
                                borderColor: duration === 30 ? 'var(--color-primary)' : 'var(--color-border)',
                                background: duration === 30 ? 'rgba(59,130,246,0.08)' : 'transparent',
                            }}
                        >
                            <span className="block text-xl font-bold mb-1">30s</span>
                            <span className="text-text-muted text-xs">{5} clips • {estimatedTime}</span>
                        </button>
                        <button
                            onClick={() => setDuration(60)}
                            className="p-4 rounded-xl border text-sm font-medium transition-all"
                            style={{
                                borderColor: duration === 60 ? 'var(--color-primary)' : 'var(--color-border)',
                                background: duration === 60 ? 'rgba(59,130,246,0.08)' : 'transparent',
                            }}
                        >
                            <span className="block text-xl font-bold mb-1">60s</span>
                            <span className="text-text-muted text-xs">{10} clips • ~40 min</span>
                        </button>
                    </div>
                </div>

                {/* Mode */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Generation type</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setMode('instant')}
                            className="p-4 rounded-xl border text-left text-sm transition-all"
                            style={{
                                borderColor: mode === 'instant' ? 'var(--color-primary)' : 'var(--color-border)',
                                background: mode === 'instant' ? 'rgba(59,130,246,0.08)' : 'transparent',
                            }}
                        >
                            <span className="block font-semibold mb-1">Instant</span>
                            <span className="text-text-muted text-xs">Start generating immediately</span>
                        </button>
                        <button
                            onClick={() => setMode('scheduled')}
                            className="p-4 rounded-xl border text-left text-sm transition-all"
                            style={{
                                borderColor: mode === 'scheduled' ? 'var(--color-primary)' : 'var(--color-border)',
                                background: mode === 'scheduled' ? 'rgba(59,130,246,0.08)' : 'transparent',
                            }}
                        >
                            <span className="block font-semibold mb-1">Scheduled</span>
                            <span className="text-text-muted text-xs">Auto-generate on a recurring basis</span>
                        </button>
                    </div>
                </div>

                {/* Schedule options */}
                {mode === 'scheduled' && (
                    <div className="mb-8 p-4 rounded-xl border border-border bg-surface animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-text-muted mb-1.5">Frequency (every X days)</label>
                                <select
                                    value={frequency}
                                    onChange={e => setFrequency(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-border bg-background text-sm text-text-primary focus:outline-none"
                                >
                                    <option value="1">Every day</option>
                                    <option value="2">Every 2 days</option>
                                    <option value="3">Every 3 days</option>
                                    <option value="7">Weekly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1.5">Time of day (UTC)</label>
                                <input
                                    type="time"
                                    value={timeOfDay}
                                    onChange={e => setTimeOfDay(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-border bg-background text-sm text-text-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary + Submit */}
                <div className="glass-card mt-4 mb-8">
                    <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-text-muted">Clips to generate</span>
                        <span className="font-medium">{clipCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-text-muted">Estimated time</span>
                        <span className="font-medium">{duration === 30 ? '~20 minutes' : '~40 minutes'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">URL expiration</span>
                        <span className="font-medium">24 hours</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!topic.trim() || submitting}
                    className="btn-primary w-full text-base"
                    style={{ padding: '16px' }}
                >
                    {submitting ? 'Submitting...' : mode === 'instant' ? 'Start generation' : 'Schedule generation'}
                </button>
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
