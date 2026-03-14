import Link from 'next/link';
import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

const Scribbles = () => {
  const rhyme = "The quick brown fox jumps over the lazy dog. ".repeat(60);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40 mix-blend-screen">
      <svg className="w-full h-full text-[#60a5fa]/30" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="p1" d="M -100 200 C 200 400, 600 0, 1100 300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <text fill="currentColor" fontSize="16" letterSpacing="3" className="uppercase font-mono opacity-80" dominantBaseline="middle">
          <textPath href="#p1" startOffset="0%">
            {rhyme}
            <animate attributeName="startOffset" from="0%" to="-100%" dur="140s" repeatCount="indefinite" />
          </textPath>
        </text>

        <path id="p2" d="M 1100 600 C 800 400, 400 900, -100 700" stroke="currentColor" strokeWidth="0.5" />
        <text fill="currentColor" fontSize="12" letterSpacing="4" className="uppercase font-mono opacity-60" dominantBaseline="middle">
          <textPath href="#p2" startOffset="0%">
            {rhyme}
            <animate attributeName="startOffset" from="0%" to="-100%" dur="170s" repeatCount="indefinite" />
          </textPath>
        </text>

        <path id="p3" d="M 200 -100 C 400 300, 0 700, 300 1100" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
        <text fill="currentColor" fontSize="22" letterSpacing="2" className="uppercase opacity-30" dominantBaseline="middle">
          <textPath href="#p3" startOffset="0%">
            {rhyme}
            <animate attributeName="startOffset" from="0%" to="-100%" dur="110s" repeatCount="indefinite" />
          </textPath>
        </text>

        <path id="p4" d="M 800 -100 C 600 400, 1000 600, 700 1100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <text fill="currentColor" fontSize="14" letterSpacing="1" className="uppercase opacity-20" dominantBaseline="middle">
          <textPath href="#p4" startOffset="0%">
            {rhyme}
            <animate attributeName="startOffset" from="0%" to="-100%" dur="130s" repeatCount="indefinite" />
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default async function Home(props: { searchParams: Promise<{ code?: string }> }) {
  const searchParams = await props.searchParams;

  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  return (
    <main className="min-h-screen text-white flex flex-col md:flex-row font-sans overflow-hidden relative bg-gradient-to-br from-[#164a80] via-[#091b3e] to-[#01030a]">
      {/* Global Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#3b82f6]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#2563eb]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <Scribbles />

      {/* Left Column: Info & Branding */}
      <section className="relative w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between overflow-hidden z-10">
        <div className="relative z-10 w-fit">
          <Logo size={48} showText={true} />
        </div>

        <div className="relative z-10 max-w-lg mt-16 md:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f69b5]/20 border border-[#1f69b5]/30 mb-6 drop-shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Autonomous Content</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white mb-6 uppercase drop-shadow-lg">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Janga</span>
          </h1>

          <p className="text-lg text-blue-100/70 font-medium leading-relaxed mb-6">
            The world's first fully autonomous video factory. Stop worrying about scripts, stock footage, and posting schedules. Connect your channels once, and watch your influence scale automatically on TikTok and YouTube.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-4 text-sm font-semibold text-blue-100">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-300 text-xs border border-white/10">1</span>
              Research trends effortlessly
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-blue-100">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-300 text-xs border border-white/10">2</span>
              Generate captivating 60s videos
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-blue-100">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-300 text-xs border border-white/10">3</span>
              Automate your global reach
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-16 md:mt-0 text-[10px] text-blue-200/50 font-mono tracking-widest uppercase">
          © 2026 Janga Platform. Beyond Creative.
        </div>
      </section>

      {/* Right Column: Login panel */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-[400px]">
          <div className="bg-[#030712]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(37,99,235,0.1)] relative overflow-hidden">
            {/* Subtle glow behind login card */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#3b82f6]/20 blur-[80px]" />
            
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-white relative z-10">
              Your Factory
            </h2>
            <p className="text-sm text-blue-100/50 mb-10 relative z-10">
              Connect via Google to access the dashboard and manage your video series.
            </p>

            <div className="relative z-10">
              <LoginForm />
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex gap-6 justify-center">
              <Link href="/privacy" className="text-xs text-blue-200/30 hover:text-blue-200/60 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-blue-200/30 hover:text-blue-200/60 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
