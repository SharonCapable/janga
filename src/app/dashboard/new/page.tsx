'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

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

export default function NewSeriesPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [niche, setNiche] = useState('')
    const [tone, setTone] = useState('')
    const [animationType, setAnimationType] = useState('Realistic')
    const [duration, setDuration] = useState('60')
    const [platform, setPlatform] = useState('tiktok')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seriesName: name,
                    niche,
                    tone,
                    animationType,
                    duration,
                    platform
                }),
            })
            if (res.ok) {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#09090b] text-[#fafafa]">
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

            <main className="flex-1 p-10 overflow-y-auto max-w-2xl">
                <Link href="/dashboard" className="text-sm text-[#a1a1aa] hover:text-white transition-colors mb-6 inline-block">
                    ← Back to manager
                </Link>

                <h1 className="text-3xl font-bold tracking-tight mb-2">Launch New Series</h1>
                <p className="text-[#a1a1aa] text-sm mb-10">
                    Define the identity for your next content brand.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Series Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. World History Daily"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Niche</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder="e.g. History"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Tone</label>
                                    <select
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option value="">Select Tone</option>
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Target Platform</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                    >
                                        {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Video Duration</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    >
                                        <option value="30">30 Seconds</option>
                                        <option value="60">60 Seconds</option>
                                        <option value="90">90 Seconds</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest ml-1">Animation Style</label>
                                <select
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                    value={animationType}
                                    onChange={(e) => setAnimationType(e.target.value)}
                                >
                                    {ANIMATION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-5 bg-white text-black text-base font-black rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Creating...' : 'Activate Series'}
                    </button>
                </form>
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
