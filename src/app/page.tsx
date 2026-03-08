import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <Logo size={40} showText={true} />
        <Link
          href="/login"
          className="px-5 py-2 text-sm font-medium text-white transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen px-6 text-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl animate-fade-in">
          The autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">video factory</span>
        </h1>

        <p className="max-w-2xl mt-8 text-lg text-zinc-400 md:text-xl font-light animate-fade-in delay-100">
          Scale your presence on TikTok and YouTube with high-retention cinematic content generated and posted while you sleep.
        </p>

        <div className="flex flex-col flex-wrap items-center justify-center gap-4 mt-12 sm:flex-row animate-fade-in delay-200">
          <Link
            href="/login"
            className="px-10 py-4 text-lg font-semibold text-white transition-all bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
          >
            Start generating
          </Link>
          <a
            href="#features"
            className="px-10 py-4 text-lg font-semibold transition-all border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">01. Connect</h3>
            <p className="text-zinc-400">Link your TikTok and YouTube accounts in seconds. Secure OAuth handles everything.</p>
          </div>
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">02. Auto-Generate</h3>
            <p className="text-zinc-400">Our AI researches topics, writes scripts, generates visuals, and stitches them together.</p>
          </div>
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">03. Post Daily</h3>
            <p className="text-zinc-400">Set your schedule once. Janga posts your content automatically at peak hours.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5">
        <Logo size={32} showText={true} className="justify-center opacity-50 transition-opacity hover:opacity-100" />
        <p className="mt-8 text-sm text-zinc-600">© 2026 Janga Platform. Built for the next generation of creators.</p>
      </footer>
    </main>
  );
}
