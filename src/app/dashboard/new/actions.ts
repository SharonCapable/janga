'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';

export async function createProject(formData: {
    topic: string;
    model: string;
    duration: number;
    tone: string;
    musicStyle: string;
    voice: string;
}) {
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
        throw new Error('Unauthorized');
    }

    // 1. Create the project
    const project = await prisma.videoProject.create({
        data: {
            userId: user.id,
            topic: formData.topic,
            modelVersion: formData.model === 'cinematic' ? 'cogvideox-5b' : 'cogvideox-2b',
            duration: formData.duration,
            status: 'generating',
        },
    });

    // 2. Add to generation queue
    await prisma.generationQueue.create({
        data: {
            projectId: project.id,
            status: 'pending',
            modelToUse: project.modelVersion,
            priority: 0,
        },
    });

    return { success: true, projectId: project.id };
}
