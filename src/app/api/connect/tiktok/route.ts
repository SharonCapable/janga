import { NextResponse } from 'next/server';

export async function GET() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = encodeURIComponent(process.env.TIKTOK_REDIRECT_URI!);
    const scope = 'user.info.basic,video.upload,video.publish';
    const state = Math.random().toString(36).substring(7);

    // In a real app, you should save the state in a cookie/session to verify it later

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

    return NextResponse.redirect(tiktokAuthUrl);
}
