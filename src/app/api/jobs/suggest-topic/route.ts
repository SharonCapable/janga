import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { seriesId } = await request.json();

    const series = await prisma.contentSeries.findUnique({
        where: { id: seriesId }
    });

    if (!series) return NextResponse.json({ error: 'Series not found' }, { status: 404 });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a viral content strategist for a video series called "${series.name}".
            The niche is "${series.niche}" and the tone is "${series.tone}".
            
            Generate ONE catchy, viral topic for the next episode. 
            It should be short (under 100 characters) and high-retention.
            Return ONLY the topic text. No quotes, no preamble.
        `;

        const result = await model.generateContent(prompt);
        const topic = result.response.text().trim();

        return NextResponse.json({ topic });
    } catch (error) {
        console.error('AI Suggest Error:', error);
        return NextResponse.json({ error: 'Failed to suggest topic' }, { status: 500 });
    }
}
