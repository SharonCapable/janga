'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EpisodeCardProps {
    episode: {
        id: string
        topic: string
        status: string
        createdAt: Date | string
    }
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!confirm('Are you sure you want to delete this episode?')) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/episodes/${episode.id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Delete Episode Error:', error)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className={`group relative p-5 glass-card border border-white/5 rounded-2xl hover:border-white/20 transition-all ${deleting ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <Link href={`/dashboard/videos/${episode.id}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                    <VideoIcon className="w-5 h-5 text-[#a1a1aa] group-hover:text-blue-400" />
                </Link>
                
                <div className="flex items-center gap-3">
                    <StatusBadge status={episode.status} />
                    
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setMenuOpen(!menuOpen)
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <EllipsisIcon className="w-5 h-5" />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 py-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <Link 
                                    href={`/dashboard/videos/${episode.id}`}
                                    className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Review Episode
                                </Link>
                                <Link 
                                    href={`/dashboard/generate?topic=${encodeURIComponent(episode.topic)}`}
                                    className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Regenerate
                                </Link>
                                <div className="h-px bg-white/5 my-1" />
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                                >
                                    Delete Episode
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Link href={`/dashboard/videos/${episode.id}`} className="block">
                <p className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">{episode.topic}</p>
                <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-widest">
                    {new Date(episode.createdAt).toLocaleDateString()}
                </p>
            </Link>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const cls = status === 'ready' ? 'bg-emerald-500/10 text-emerald-400'
        : status === 'generating' || status === 'booting' ? 'bg-amber-500/10 text-amber-400'
            : status === 'error' ? 'bg-red-500/10 text-red-400'
                : 'bg-white/5 text-[#52525b]'

    return (
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${cls}`}>
            {status}
        </span>
    )
}

function VideoIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
}

function EllipsisIcon({ className }: { className?: string }) {
    return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
}
