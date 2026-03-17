import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    const { keywords } = await request.json();

    const fallbackKeywords = "A completely random, high-retention viral faceless channel concept in any niche";
    const targetKeywords = keywords || fallbackKeywords;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            You are a viral content strategist. A user wants to start an AI video series based on these keywords: "${targetKeywords}".
            
            Based on these, generate a professional content strategy in JSON format:
            {
                "seriesName": "A catchy, short name for the series",
                "niche": "The specific niche (e.g. Finance, Horror, Stoicism, AI News)",
                "tone": "Descriptive tone (e.g. Cinematic, Dramatic, Fast-paced, Minimalist)",
                "animationType": "One of: Realistic, Anime / Manga, 3D Render, Comic Book, Cyberpunk, Sketch / Hand-drawn",
                "duration": 60,
                "firstTopic": "A specific topic for the first episode"
            }
            
            Return ONLY the raw JSON. No markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean any potential markdown wrapping
        const cleanedJson = responseText.replace(/```json|```/g, "").trim();
        const strategy = JSON.parse(cleanedJson);

        return NextResponse.json(strategy);
    } catch (error) {
        console.error('AI Strategy Error:', error);
        return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 });
    }
}
