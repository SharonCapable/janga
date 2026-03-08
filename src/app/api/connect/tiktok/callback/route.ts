import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(`${origin}/dashboard?error=tiktok_denied`);
    }

    try {
        // 1. Exchange code for tokens
        const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_key: process.env.TIKTOK_CLIENT_KEY!,
                client_secret: process.env.TIKTOK_CLIENT_SECRET!,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('TikTok Token Error:', data);
            return NextResponse.redirect(`${origin}/dashboard?error=tiktok_token_failed`);
        }

        const { access_token, refresh_token, open_id } = data;

        // 2. Get TikTok User Info (optional, to get channel name)
        const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,username', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const userData = await userResponse.json();
        const channelName = userData?.data?.user?.display_name || userData?.data?.user?.username || 'TikTok Channel';

        // 3. Save to Supabase
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.redirect(`${origin}/login`);
        }

        const { error: dbError } = await supabase
            .from('channels')
            .insert({
                user_id: user.id,
                platform: 'tiktok',
                channel_name: channelName,
                oauth_token: access_token, // In production, encrypt this!
                refresh_token: refresh_token,
                connected_at: new Date().toISOString(),
            });

        if (dbError) {
            console.error('Supabase Error:', dbError);
            return NextResponse.redirect(`${origin}/dashboard?error=db_save_failed`);
        }

        return NextResponse.redirect(`${origin}/dashboard?success=tiktok_connected`);
    } catch (err) {
        console.error('TikTok Connection Error:', err);
        return NextResponse.redirect(`${origin}/dashboard?error=server_error`);
    }
}
