'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    // Account Setup
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

    // Series Details
    const [seriesName, setSeriesName] = useState('')
    const [niche, setNiche] = useState('')
    const [tone, setTone] = useState('')
    const [animationType, setAnimationType] = useState('Realistic')
    const [duration, setDuration] = useState('60')

    // AI Helpers
    const [keywords, setKeywords] = useState('')
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const togglePlatform = (id: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const handleAiSuggest = async () => {
        setIsAiLoading(true);
        try {
            const res = await fetch('/api/onboarding/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords }),
            });
            const data = await res.json();
            setSeriesName(data.seriesName);
            setNiche(data.niche);
            setTone(data.tone);
            if (data.animationType) setAnimationType(data.animationType);
            setDuration(data.duration.toString());
            setStep(3); // Jump to series review
        } catch (error) {
            console.error(error);
        } finally {
            setIsAiLoading(false);
        }
    }

    const handleComplete = async () => {
        setSubmitting(true)
        try {
            await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seriesName,
                    niche,
                    tone,
                    animationType,
                    duration,
                    platforms: selectedPlatforms,
                    primaryPlatform: selectedPlatforms[0] || 'tiktok'
                }),
            })
            router.push('/dashboard')
        } catch {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[150px] -z-10" />

            <div className="w-full max-w-lg mx-4">
                <div className="flex justify-center mb-12">
                    <Logo size={40} showText={true} />
                </div>

                {/* Step 1: Platforms */}
                {step === 1 && (
                    <div className="animate-fade-in space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-3 tracking-tight">Connect your world</h1>
                            <p className="text-zinc-400 text-sm">Where do you want Janga to post? You can connect specific accounts later.</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {PLATFORMS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className="p-5 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between"
                                    style={{
                                        borderColor: selectedPlatforms.includes(p.id) ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                        background: selectedPlatforms.includes(p.id) ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)',
                                    }}
                                >
                                    <span>{p.label}</span>
                                    {selectedPlatforms.includes(p.id) && (
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn-primary w-full"
                            disabled={selectedPlatforms.length === 0}
                            onClick={() => setStep(2)}
                        >
                            Next: Launch a Series
                        </button>
                    </div>
                )}

                {/* Step 2: Choose Series Style */}
                {step === 2 && (
                    <div className="animate-fade-in space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-3 tracking-tight">Your first content series</h1>
                            <p className="text-zinc-400 text-sm">Every series has its own niche, tone, and personality.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                                <label className="text-xs font-semibold text-primary uppercase tracking-wider">AI Magic Brainstorm</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. gym motivation, space facts..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary transition-colors outline-none pr-28"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                                    />
                                    <button
                                        onClick={handleAiSuggest}
                                        disabled={isAiLoading}
                                        className="absolute right-2 top-2 bottom-2 px-3 bg-primary/20 text-primary text-xs font-bold rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50"
                                    >
                                        {isAiLoading ? 'Thinking...' : 'AI Magic'}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center py-2 text-zinc-600 text-xs font-medium uppercase tracking-widest">— OR —</div>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-4 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                Build manually
                            </button>
                            <button className="w-full text-zinc-500 text-xs hover:text-white transition-colors" onClick={() => setStep(1)}>Back to platforms</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Series Details */}
                {step === 3 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-2 tracking-tight">Series Blueprint</h1>
                            <p className="text-zinc-400 text-sm">Fine-tune the identity of your new series.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Series Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary"
                                    value={seriesName}
                                    onChange={(e) => setSeriesName(e.target.value)}
                                    placeholder="The Daily Pulse"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Niche</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder="Finance"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Tone</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option value="" className="bg-zinc-900 text-white">Select Tone</option>
                                        {TONES.map(t => <option key={t} value={t} className="bg-zinc-900 text-white">{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Animation Style</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-sm outline-none focus:border-primary appearance-none"
                                    value={animationType}
                                    onChange={(e) => setAnimationType(e.target.value)}
                                >
                                    {ANIMATION_TYPES.map(a => <option key={a} value={a} className="bg-zinc-900 text-white">{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button className="flex-1 py-4 text-zinc-400 hover:text-white text-sm font-medium" onClick={() => setStep(2)}>Back</button>
                            <button
                                className="btn-primary flex-1"
                                disabled={!seriesName || !niche || !tone || submitting}
                                onClick={handleComplete}
                            >
                                {submitting ? 'Launching...' : 'Activate Dashboard'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
