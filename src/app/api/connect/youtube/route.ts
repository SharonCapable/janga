import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.YOUTUBE_REDIRECT_URI!);
    const scope = encodeURIComponent([
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' '));
    const state = Math.random().toString(36).substring(7);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

    return NextResponse.redirect(googleAuthUrl, 302);
}
