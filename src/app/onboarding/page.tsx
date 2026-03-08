'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

const NICHES = [
    'Finance & Investing',
    'Fitness & Health',
    'History & Civilizations',
    'Motivation & Mindset',
    'Technology & AI',
    'True Crime',
    'Science & Nature',
    'Philosophy',
]

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

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [niche, setNiche] = useState('')
    const [tone, setTone] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    const togglePlatform = (id: string) => {
        setPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const handleComplete = async () => {
        setSubmitting(true)
        try {
            await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche, tone, platforms }),
            })
            router.push('/dashboard')
        } catch {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-secondary/5 blur-[150px] -z-10" />

            <div className="w-full max-w-lg mx-4">
                {/* Logo */}
                <div className="flex justify-center mb-12">
                    <Logo size={40} showText={true} />
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-10">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                background: step >= s
                                    ? 'var(--color-primary)'
                                    : 'var(--color-border)',
                            }}
                        />
                    ))}
                </div>

                {/* Step 1: Niche */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold mb-2 tracking-tight">
                            What content do you create?
                        </h1>
                        <p className="text-text-secondary text-sm mb-8">
                            Select a niche so we can tailor scripts and visuals to your audience.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {NICHES.map(n => (
                                <button
                                    key={n}
                                    onClick={() => setNiche(n)}
                                    className="p-4 rounded-xl border text-left text-sm font-medium transition-all"
                                    style={{
                                        borderColor: niche === n ? 'var(--color-primary)' : 'var(--color-border)',
                                        background: niche === n ? 'rgba(59,130,246,0.08)' : 'transparent',
                                        color: niche === n ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    }}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn-primary w-full mt-8"
                            disabled={!niche}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Tone */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold mb-2 tracking-tight">
                            Choose your tone
                        </h1>
                        <p className="text-text-secondary text-sm mb-8">
                            This sets the narration style and overall feel of your videos.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {TONES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className="p-4 rounded-xl border text-left text-sm font-medium transition-all"
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
                        <div className="flex gap-3 mt-8">
                            <button className="btn-secondary flex-1" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button
                                className="btn-primary flex-1"
                                disabled={!tone}
                                onClick={() => setStep(3)}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Platform */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold mb-2 tracking-tight">
                            Where do you want to post?
                        </h1>
                        <p className="text-text-secondary text-sm mb-8">
                            Select the platforms you want Janga to post to. You can connect accounts later.
                        </p>
                        <div className="flex flex-col gap-3">
                            {PLATFORMS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className="p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between"
                                    style={{
                                        borderColor: platforms.includes(p.id) ? 'var(--color-primary)' : 'var(--color-border)',
                                        background: platforms.includes(p.id) ? 'rgba(59,130,246,0.08)' : 'transparent',
                                    }}
                                >
                                    <span>{p.label}</span>
                                    {platforms.includes(p.id) && (
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button className="btn-secondary flex-1" onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button
                                className="btn-primary flex-1"
                                disabled={platforms.length === 0 || submitting}
                                onClick={handleComplete}
                            >
                                {submitting ? 'Setting up...' : 'Complete setup'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
