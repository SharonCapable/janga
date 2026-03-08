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
        <div className="min-h-screen flex bg-[#09090b] text-[#fafafa]">
            <aside className="w-64 border-r border-white/5 flex flex-col p-6 shrink-0 bg-[#09090b]">
                <div className="mb-12">
                    <Logo size={36} showText={true} />
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarLink href="/dashboard" label="Series Manager" />
                    <SidebarLink href="/dashboard/videos" label="All Episodes" />
                    <SidebarLink href="/dashboard/settings" label="Settings" active />
                </nav>
                <div className="pt-6 border-t border-white/5">
                    <SignOutButton />
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-[#a1a1aa] text-sm mb-10">
                    Manage your account, connected platforms, and billing.
                </p>

                {/* Profile */}
                <section className="mb-10">
                    <h2 className="text-xs font-bold text-[#52525b] uppercase tracking-widest mb-4">Profile</h2>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                        {user.user_metadata?.avatar_url && (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                        )}
                        <div>
                            <p className="font-bold">{user.user_metadata?.full_name || 'User'}</p>
                            <p className="text-sm text-[#a1a1aa]">{user.email}</p>
                        </div>
                    </div>
                </section>

                {/* Connected accounts */}
                <section className="mb-10">
                    <h2 className="text-xs font-bold text-[#52525b] uppercase tracking-widest mb-4">Connected platforms</h2>
                    <div className="flex flex-col gap-3">
                        {channels && channels.length > 0 ? (
                            channels.map((ch: any) => (
                                <div key={ch.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <div>
                                            <p className="text-sm font-bold">{ch.channel_name}</p>
                                            <p className="text-[10px] text-[#52525b] uppercase font-black tracking-widest">{ch.platform}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-rose-500/50 hover:text-rose-500 transition-colors">Disconnect</button>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                                <p className="text-sm text-[#52525b]">No accounts connected yet.</p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-4">
                            <a href="/api/connect/tiktok" className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                                Connect TikTok
                            </a>
                            <a href="/api/connect/youtube" className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                                Connect YouTube
                            </a>
                        </div>
                    </div>
                </section>

                {/* Billing */}
                <section>
                    <h2 className="text-xs font-bold text-[#52525b] uppercase tracking-widest mb-4">Plan & Billing</h2>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold">Standard Account</p>
                                <p className="text-xs text-[#a1a1aa] mt-0.5 capitalize">{dbUser?.subscriptionTier || 'Free'} Plan</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Coming Soon</span>
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
