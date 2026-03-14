'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

function GenerateForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlSeriesId = searchParams.get('seriesId')

    const [series, setSeries] = useState<any[]>([])
    const [selectedSeriesId, setSelectedSeriesId] = useState(urlSeriesId || '')
    const [topic, setTopic] = useState('')
    const [continueSeries, setContinueSeries] = useState(true)
    const [duration, setDuration] = useState<30 | 60>(60)
    const [submitting, setSubmitting] = useState(false)
    const [loadingSeries, setLoadingSeries] = useState(true)

    useEffect(() => {
        fetchSeries()
    }, [])

    const fetchSeries = async () => {
        try {
            const res = await fetch('/api/series')
            const data = await res.json()
            setSeries(data)
            if (!selectedSeriesId && data.length > 0) {
                setSelectedSeriesId(data[0].id)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingSeries(false)
        }
    }

    const handleSubmit = async () => {
        if (!selectedSeriesId) return
        setSubmitting(true)

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seriesId: selectedSeriesId,
                    topic: topic.trim() || undefined,
                    continueSeries,
                    duration,
                }),
            })
            const data = await res.json()
            if (data.success) {
                await fetch('/api/start-pipeline', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ projectId: data.projectId })
                })
                router.push('/dashboard')
            }
        } catch {
            setSubmitting(false)
        }
    }

    const [suggesting, setSuggesting] = useState(false)

    const handleSuggestTopic = async () => {
        if (!selectedSeriesId) return
        setSuggesting(true)
        try {
            const res = await fetch('/api/jobs/suggest-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seriesId: selectedSeriesId }),
            })
            const data = await res.json()
            if (data.topic) setTopic(data.topic)
        } catch (error) {
            console.error(error)
        } finally {
            setSuggesting(false)
        }
    }

    const selectedSeries = series.find(s => s.id === selectedSeriesId)

    return (
        <div className="min-h-screen flex bg-[#09090b] text-[#fafafa]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col p-6 shrink-0 bg-[#09090b]">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Series Manager" />
                    <SidebarLink href="/dashboard/videos" label="All Episodes" />
                    <SidebarLink href="/dashboard/settings" label="Settings" />
                </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto max-w-3xl">
                <Link href="/dashboard" className="text-sm text-[#a1a1aa] hover:text-white transition-colors mb-6 inline-block">
                    ← Back to manager
                </Link>

                <h1 className="text-3xl font-bold tracking-tight mb-2">New Episode</h1>
                <p className="text-[#a1a1aa] text-sm mb-10">
                    Add a new video to your content series.
                </p>

                {/* Series Selection */}
                <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <label className="block text-xs font-bold text-[#52525b] uppercase tracking-widest mb-3">Target Series</label>
                    {loadingSeries ? (
                        <div className="h-12 bg-white/5 animate-pulse rounded-xl" />
                    ) : (
                        <select
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none appearance-none"
                        >
                            {series.map(s => (
                                <option key={s.id} value={s.id} className="bg-zinc-900 text-white">{s.name} ({s.niche})</option>
                            ))}
                        </select>
                    )}
                </div>

                {selectedSeries && (
                    <div className="animate-fade-in">
                        {/* Continuity Toggle */}
                        <div className="mb-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Consistency Mode</h3>
                                <p className="text-xs text-[#a1a1aa]">AI will analyze previous episodes to maintain style & story.</p>
                            </div>
                            <button
                                onClick={() => setContinueSeries(!continueSeries)}
                                className={`w-12 h-6 rounded-full transition-all relative ${continueSeries ? 'bg-blue-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all ${continueSeries ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Topic */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest">Episode Topic</label>
                                <button
                                    onClick={handleSuggestTopic}
                                    disabled={suggesting}
                                    className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300 transition-colors disabled:opacity-50"
                                >
                                    {suggesting ? 'Brainstorming...' : '✨ Magic Suggest'}
                                </button>
                            </div>
                            <textarea
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder={`Leave blank for AI decision, or type a custom topic...`}
                                className="w-full h-32 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm resize-none focus:outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]"
                            />
                        </div>

                        {/* Duration */}
                        <div className="mb-10">
                            <label className="block text-xs font-bold text-[#52525b] uppercase tracking-widest mb-3">Duration</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setDuration(30)}
                                    className={`p-5 rounded-2xl border text-left transition-all ${duration === 30 ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/[0.01]'}`}
                                >
                                    <span className="block text-xl font-bold mb-1">30s</span>
                                    <span className="text-[#a1a1aa] text-xs">Fast & viral</span>
                                </button>
                                <button
                                    onClick={() => setDuration(60)}
                                    className={`p-5 rounded-2xl border text-left transition-all ${duration === 60 ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/[0.01]'}`}
                                >
                                    <span className="block text-xl font-bold mb-1">60s</span>
                                    <span className="text-[#a1a1aa] text-xs">Deep dive</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-5 bg-white text-black text-base font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Initiating Pipeline...' : 'Start Generation'}
                        </button>
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
            }}
        >
            {label}
        </Link>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <GenerateForm />
        </Suspense>
    )
}
