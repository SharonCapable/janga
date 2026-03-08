'use client'

import { createClient } from '@/utils/supabase'
import { useState } from 'react'
import Logo from '@/components/Logo'
import Link from 'next/link'

export default function LoginPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            alert(error.message)
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] -z-10" />

            <div className="glass-card animate-fade-in w-full max-w-[420px] mx-4 text-center" style={{ padding: '48px 40px' }}>
                <div className="flex justify-center mb-8">
                    <Logo size={48} showText={true} />
                </div>

                <h1 className="text-2xl font-bold mb-3 tracking-tight">
                    Welcome back
                </h1>
                <p className="text-text-secondary mb-10 text-sm leading-relaxed">
                    Sign in to manage your video automations and connected channels.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn-primary w-full text-base"
                    style={{ padding: '14px 24px' }}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {loading ? 'Connecting...' : 'Continue with Google'}
                </button>

                {/* Replaced the existing p tag with the new div block */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#52525b]">
                        &copy; 2026 Janga. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
