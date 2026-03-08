'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface VideoDetail {
    id: string
    topic: string
    status: string
    duration: number
    createdAt: string
    finalVideos: { id: string; storageUrl: string; postedAt: string | null }[]
}

export default function VideoReviewPage() {
    const params = useParams()
    const router = useRouter()
    const [video, setVideo] = useState<VideoDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [urlExpired, setUrlExpired] = useState(false)

    useEffect(() => {
        const fetchVideo = async () => {
            const res = await fetch('/api/jobs')
            const data = await res.json()
            const found = data.find((p: any) => p.id === params.id)
            if (found) {
                setVideo(found)
                // Check if signed URL might be expired (older than 1 hour)
                if (found.finalVideos[0]) {
                    const created = new Date(found.createdAt).getTime()
                    const hourAgo = Date.now() - 60 * 60 * 1000
                    if (created < hourAgo) {
                        setUrlExpired(true)
                    }
                }
            }
            setLoading(false)
        }
        fetchVideo()
    }, [params.id])

    const handleApprove = async () => {
        setPosting(true)
        // This would call POST /api/post with the video ID
        // For now, mark as approved in UI
        setTimeout(() => {
            setPosting(false)
            router.push('/dashboard')
        }, 2000)
    }

    const handleRegenerate = () => {
        router.push(`/dashboard/generate?topic=${encodeURIComponent(video?.topic || '')}`)
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-text-secondary">Loading...</p>
            </main>
        )
    }

    if (!video) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-text-secondary mb-4">Video not found.</p>
                    <Link href="/dashboard" className="btn-primary">Return to dashboard</Link>
                </div>
            </main>
        )
    }

    const finalVideo = video.finalVideos[0]

    return (
        <main className="min-h-screen p-10 max-w-4xl mx-auto">
            <Link href="/dashboard/videos" className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-8 inline-block">
                &larr; Back to videos
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Video Player */}
                <div>
                    {urlExpired && (
                        <div className="mb-4 p-3 rounded-lg border border-warning/20 bg-warning/5 text-sm text-warning">
                            This signed URL may have expired. The video link is valid for 24 hours after generation.
                        </div>
                    )}

                    <div className="w-full aspect-[9/16] rounded-2xl bg-surface overflow-hidden border border-border">
                        {finalVideo?.storageUrl ? (
                            <video
                                src={finalVideo.storageUrl}
                                controls
                                className="w-full h-full object-contain"
                                preload="metadata"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-sm text-text-muted">Video not yet available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details + Actions */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight mb-2">{video.topic}</h1>
                    <p className="text-sm text-text-muted mb-6">
                        {video.duration}s &middot; Created {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="glass-card mb-6">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-text-muted">Status</span>
                            <span className={`status-badge ${video.status === 'ready' ? 'status-complete' : 'status-processing'}`}>
                                {video.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-text-muted">Video file</span>
                            <span className="font-medium">{finalVideo ? 'Available' : 'Generating...'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">Posted</span>
                            <span className="font-medium">
                                {finalVideo?.postedAt
                                    ? new Date(finalVideo.postedAt).toLocaleDateString()
                                    : 'Not yet'}
                            </span>
                        </div>
                    </div>

                    {finalVideo && (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleApprove}
                                disabled={posting}
                                className="btn-primary w-full"
                                style={{ padding: '14px' }}
                            >
                                {posting ? 'Posting...' : 'Approve and post'}
                            </button>
                            <button
                                onClick={handleRegenerate}
                                className="btn-secondary w-full"
                                style={{ padding: '14px' }}
                            >
                                Regenerate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
