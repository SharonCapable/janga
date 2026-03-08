import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/utils/prisma'
import Link from 'next/link'
import Logo from '@/components/Logo'
import SignOutButton from '@/components/SignOutButton'

export default async function SettingsPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    const channels = await supabase.from('channels').select('*').eq('user_id', user.id).then(res => res.data)

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r border-border flex flex-col p-6 shrink-0">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Dashboard" />
                    <SidebarLink href="/dashboard/generate" label="Generate" />
                    <SidebarLink href="/dashboard/videos" label="Videos" />
                    <SidebarLink href="/dashboard/settings" label="Settings" active />
                </nav>
                <div className="pt-6 border-t border-border">
                    <SignOutButton />
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto max-w-3xl">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-text-secondary text-sm mb-10">
                    Manage your account, connected platforms, and default preferences.
                </p>

                {/* Profile */}
                <section className="mb-10">
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Profile</h2>
                    <div className="glass-card flex items-center gap-4">
                        {user.user_metadata?.avatar_url && (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                        )}
                        <div>
                            <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                            <p className="text-sm text-text-muted">{user.email}</p>
                        </div>
                    </div>
                </section>

                {/* Defaults */}
                <section className="mb-10">
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Defaults</h2>
                    <div className="glass-card">
                        <div className="flex items-center justify-between py-3 border-b border-border">
                            <div>
                                <p className="text-sm font-medium">Content niche</p>
                                <p className="text-xs text-text-muted mt-0.5">{dbUser?.defaultNiche || 'Not set'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium">Default tone</p>
                                <p className="text-xs text-text-muted mt-0.5">{dbUser?.defaultTone || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Connected accounts */}
                <section className="mb-10">
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Connected accounts</h2>
                    <div className="flex flex-col gap-3">
                        {channels && channels.length > 0 ? (
                            channels.map((ch: any) => (
                                <div key={ch.id} className="glass-card flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-success" />
                                        <div>
                                            <p className="text-sm font-medium">{ch.channel_name}</p>
                                            <p className="text-xs text-text-muted capitalize">{ch.platform}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-error hover:underline">Disconnect</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-text-secondary">No accounts connected.</p>
                        )}

                        <div className="flex gap-3 mt-2">
                            <a href="/api/connect/tiktok" className="btn-secondary text-sm flex-1 text-center">
                                Connect TikTok
                            </a>
                            <a href="/api/connect/youtube" className="btn-secondary text-sm flex-1 text-center">
                                Connect YouTube
                            </a>
                        </div>
                    </div>
                </section>

                {/* Billing */}
                <section>
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Billing</h2>
                    <div className="glass-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Current plan</p>
                                <p className="text-xs text-text-muted mt-0.5 capitalize">{dbUser?.subscriptionTier || 'Free'}</p>
                            </div>
                            <button className="btn-primary text-sm" disabled>
                                Coming soon
                            </button>
                        </div>
                    </div>
                </section>
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
