import Link from 'next/link';
import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';

export default async function Home(props: { searchParams: Promise<{ code?: string }> }) {
  const searchParams = await props.searchParams;

  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-white font-sans overflow-x-hidden">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-xl bg-black/40 border-b border-white/[0.05]">
        <Logo size={32} showText={true} />
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block">
            Login
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 text-sm font-bold text-black transition-all bg-white rounded-full hover:bg-zinc-200 shadow-lg shadow-white/5 active:scale-95"
          >
            Start Factory
          </Link>
        </div>
      </nav>

      {/* Hero Section: The "Transcend" Style */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl w-full text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/60">The New Era of Video</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white mb-8 animate-fade-in uppercase italic">
            Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">Generation</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-zinc-400 md:text-xl font-medium tracking-tight mb-12 animate-fade-in delay-100 italic">
            Janga is the world's first autonomous video factory. Connect once, scale forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <Link
              href="/login"
              className="group relative px-12 py-5 text-xl font-black text-white transition-all bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              CREATE YOUR SERIES
            </Link>
          </div>
        </div>

        {/* Decorative Element: Floating Dashboards Sketch */}
        <div className="mt-24 w-full max-w-5xl aspect-video rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-[1px] relative animate-fade-in delay-300">
          <div className="w-full h-full bg-[#050505] rounded-[31px] overflow-hidden p-8 flex flex-col justify-center items-center">
            <div className="text-center">
              <div className="text-4xl font-black mb-2 italic">FACTORY STATUS: <span className="text-emerald-500">LIVE</span></div>
              <div className="text-zinc-500 font-mono text-sm tracking-widest">AWAITING CONNECTION...</div>
            </div>
          </div>
          {/* Accent Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl -z-10" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-6 py-40 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tighter leading-none mb-8 uppercase italic">
            Automate <br />
            your <span className="text-zinc-600">influence</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-6 font-medium">
            Stop worrying about scripts, stock footage, and posting schedules. Janga researches the trends, writes the narrative, and builds the visual story for you.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 border-l-2 border-purple-500 pl-6 py-2">
              <span className="text-2xl font-black italic">01. RESEARCH</span>
            </div>
            <div className="flex items-center gap-4 border-l-2 border-pink-500 pl-6 py-2">
              <span className="text-2xl font-black italic">02. GENERATE</span>
            </div>
            <div className="flex items-center gap-4 border-l-2 border-blue-500 pl-6 py-2">
              <span className="text-2xl font-black italic">03. SCALE</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-square rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
          <PlayButton className="w-24 h-24 text-white drop-shadow-2xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-12 border-t border-white/5 bg-black">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 max-w-7xl mx-auto">
          <div>
            <Logo size={40} showText={true} />
            <p className="mt-4 text-zinc-500 max-w-xs text-sm">
              The first autonomous content factory for the next generation of social influence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#52525b]">Legal</span>
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#52525b]">Contact</span>
              <span className="text-sm text-zinc-500">senyonam557@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-zinc-700 font-mono">
          © 2026 JANGA PLATFORM. BEYOND CREATIVE.
        </div>
      </footer>
    </main>
  );
}

function PlayButton({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
