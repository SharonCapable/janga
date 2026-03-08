'use client'

import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                width: '100%',
                marginTop: '1rem',
                color: 'hsla(var(--text-secondary), 0.7)',
                transition: 'color 0.2s'
            }}
        >
            <LogOut size={20} />
            <span>Sign Out</span>
        </button>
    )
}
