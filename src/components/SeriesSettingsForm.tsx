'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TONES = [
    'Cinematic',
    'Educational',
    'Dramatic',
    'Calm & Soothing',
    'Mysterious',
    'Inspirational',
]

const PLATFORMS = [
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram Reels' },
    { id: 'youtube', label: 'YouTube Shorts' },
]

const ANIMATION_TYPES = [
    'Realistic',
    'Anime / Manga',
    '3D Render',
    'Comic Book',
    'Cyberpunk',
    'Sketch / Hand-drawn'
]

interface SeriesSettingsFormProps {
    series: {
        id: string
        name: string
        niche: string
        tone: string
        animationType: string | null
        duration: number
        platform: string
    }
}

export default function SeriesSettingsForm({ series }: SeriesSettingsFormProps) {
    const router = useRouter()
    const [name, setName] = useState(series.name)
    const [niche, setNiche] = useState(series.niche)
    const [tone, setTone] = useState(series.tone)
    const [animationType, setAnimationType] = useState(series.animationType || 'Realistic')
    const [duration, setDuration] = useState(series.duration.toString())
    const [platform, setPlatform] = useState(series.platform)
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch(`/api/series/${series.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    niche,
                    tone,
                    animationType,
                    duration,
                    platform
                }),
            })
            if (res.ok) {
                router.push(`/dashboard/series/${series.id}`)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this series? This will delete all episodes and cannot be undone.')) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/series/${series.id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <Link href={`/dashboard/series/${series.id}`} className="text-sm text-[#a1a1aa] hover:text-white transition-colors mb-6 inline-block">
                ← Back to series
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-2">Series Settings</h1>
            <p className="text-[#a1a1aa] text-sm mb-10">
                Update the configuration for <strong>{series.name}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 shadow-xl">
                        <div>
                            <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Series Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Niche</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Tone</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        {TONES.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs mt-1">▼</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Target Platform</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                    >
                                        {PLATFORMS.map(p => <option key={p.id} value={p.id} className="bg-zinc-900">{p.label}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs mt-1">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Video Duration</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    >
                                        <option value="30" className="bg-zinc-900">30 Seconds</option>
                                        <option value="60" className="bg-zinc-900">60 Seconds</option>
                                        <option value="90" className="bg-zinc-900">90 Seconds</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs mt-1">▼</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Animation Style</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                    value={animationType}
                                    onChange={(e) => setAnimationType(e.target.value)}
                                >
                                    {ANIMATION_TYPES.map(a => <option key={a} value={a} className="bg-zinc-900">{a}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs mt-1">▼</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-10 py-4 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary/80 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="text-xs font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                        {deleting ? 'Deleting...' : 'Delete Series'}
                    </button>
                </div>
            </form>
        </div>
    )
}
