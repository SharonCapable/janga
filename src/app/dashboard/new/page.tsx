
'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Sparkles, Wand2, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { createProject } from './actions';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function NewProject() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [topic, setTopic] = useState('');
    const [model, setModel] = useState('standard');
    const [duration, setDuration] = useState('60'); // default to 60s
    const [tone, setTone] = useState('Epic');
    const [musicStyle, setMusicStyle] = useState('Cinematic');
    const [voice, setVoice] = useState('Traditional Griot (Cloned)');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await createProject({
                topic,
                model,
                duration: parseInt(duration),
                tone,
                musicStyle,
                voice,
            });
            if (result.success) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/dashboard" className="glass-card" style={{ padding: '10px' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Logo size={32} showText={false} />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                        NEW <span className="text-gradient">AUTOMATION</span>
                    </h1>
                </div>
            </header>

            {/* Progress Stepper */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} style={{
                        flex: 1,
                        height: '4px',
                        background: step >= s ? 'hsl(var(--primary))' : 'hsl(var(--surface))',
                        borderRadius: '2px',
                        transition: 'background 0.3s'
                    }} />
                ))}
            </div>

            <div className="animate-fade-in">
                {step === 1 && (
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>What's the topic?</h2>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                            Enter a subject or a prompt. Our AI will research and generate a script for you.
                        </p>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. The forgotten empires of West Africa..."
                            style={{
                                width: '100%',
                                height: '150px',
                                background: 'hsl(var(--surface))',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                color: 'white',
                                fontSize: '1.1rem',
                                marginBottom: '2rem',
                                resize: 'none'
                            }}
                        />
                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => setStep(2)}
                            disabled={!topic.trim()}
                        >
                            Continue <Sparkles size={18} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Visual Engine & Format</h2>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                            Choose the quality level and duration for your content.
                        </p>

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Rendering Engine</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <ModelOption
                                id="standard"
                                name="Standard Performance"
                                desc="Optimized for speed. Perfect for daily updates."
                                active={model === 'standard'}
                                onSelect={() => setModel('standard')}
                            />
                            <ModelOption
                                id="cinematic"
                                name="Cinematic High-Detail"
                                desc="Priority rendering with enhanced detail and realism."
                                active={model === 'cinematic'}
                                onSelect={() => setModel('cinematic')}
                            />
                        </div>

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Video Duration</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                onClick={() => setDuration('30')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: `2px solid ${duration === '30' ? 'hsl(var(--primary))' : 'var(--glass-border)'}`,
                                    background: duration === '30' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                30 Seconds
                            </button>
                            <button
                                onClick={() => setDuration('60')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: `2px solid ${duration === '60' ? 'hsl(var(--primary))' : 'var(--glass-border)'}`,
                                    background: duration === '60' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                60 Seconds
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                            <button className="glass-card" style={{ padding: '12px 24px' }} onClick={() => setStep(1)}>Back</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Configure Style</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Tone & Aesthetics</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                            <StyleSelect
                                label="Narration Tone"
                                value={tone}
                                onChange={(e: any) => setTone(e.target.value)}
                                options={['Epic', 'Educational', 'Mysterious', 'Warm Storytelling']}
                            />
                            <StyleSelect
                                label="Music Style"
                                value={musicStyle}
                                onChange={(e: any) => setMusicStyle(e.target.value)}
                                options={['Cinematic', 'Lo-fi', 'Traditional African', 'Ambient']}
                            />
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Voice Narrative</h3>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Select an authentic voice or use your cloned presets.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            <VoiceOption
                                name="Traditional Griot (Cloned)"
                                selected={voice === 'Traditional Griot (Cloned)'}
                                onClick={() => setVoice('Traditional Griot (Cloned)')}
                            />
                            <VoiceOption
                                name="Modern Academic"
                                selected={voice === 'Modern Academic'}
                                onClick={() => setVoice('Modern Academic')}
                            />
                            <VoiceOption
                                name="Deep Cinematic"
                                selected={voice === 'Deep Cinematic'}
                                onClick={() => setVoice('Deep Cinematic')}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="glass-card" style={{ padding: '12px 24px' }} onClick={() => setStep(2)}>Back</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(4)}>Finalize Schedule</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Clock size={48} style={{ color: 'hsl(var(--primary))', marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Ready to Launch?</h2>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>
                            Setting schedule for: **Daily at 18:00 (UTC)**.<br />
                            Target Duration: **{duration} Seconds**.<br />
                            A first draft will be generated in ~5 minutes for your approval.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deploying...' : 'Deploy Automation'} <Send size={18} />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

function ModelOption({ id, name, desc, active, onSelect }: any) {
    return (
        <div
            onClick={onSelect}
            style={{
                padding: '1.5rem',
                borderRadius: '16px',
                border: `2px solid ${active ? 'hsl(var(--primary))' : 'var(--glass-border)'}`,
                background: active ? 'hsla(var(--primary), 0.05)' : 'hsla(240, 10%, 15%, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}
        >
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${active ? 'hsl(var(--primary))' : 'var(--text-secondary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {active && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'hsl(var(--primary))' }} />}
            </div>
            <div>
                <p style={{ fontWeight: 'bold' }}>{name}</p>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>{desc}</p>
            </div>
        </div>
    );
}

function VoiceOption({ name, selected = false, onClick }: { name: string, selected?: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '1rem',
                borderRadius: '12px',
                border: `1px solid ${selected ? 'hsl(var(--primary))' : 'var(--glass-border)'}`,
                background: selected ? 'hsla(var(--primary), 0.05)' : 'hsl(var(--surface))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
            }}
        >
            <span style={{ fontWeight: selected ? 600 : 400 }}>{name}</span>
            {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--primary))' }} />}
        </div>
    );
}

function StyleSelect({ label, value, onChange, options }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</p>
            <select
                value={value}
                onChange={onChange}
                style={{
                    padding: '12px',
                    background: 'hsl(var(--surface))',
                    color: 'white',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px'
                }}
            >
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
