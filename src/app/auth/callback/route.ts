import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL after successful sign in
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Sync with Prisma User model
            const user = data.user;

            const dbUser = await prisma.user.upsert({
                where: { id: user.id },
                update: {
                    email: user.email,
                    name: user.user_metadata.full_name || user.user_metadata.name,
                    image: user.user_metadata.avatar_url,
                },
                create: {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata.full_name || user.user_metadata.name,
                    image: user.user_metadata.avatar_url,
                },
            });

            // Redirect to onboarding if not yet onboarded
            const redirectPath = dbUser.onboarded ? next : '/onboarding'
            return NextResponse.redirect(`${origin}${redirectPath}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
