'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function FindingMatches() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/match-found');
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[120px] pulse-layer" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#131313_80%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
        <div className="relative w-48 h-48 mb-16 flex items-center justify-center">
          <div className="absolute inset-0 border border-primary/10 rounded-full scale-125" />
          <div className="absolute inset-0 border border-primary/20 rounded-full scale-110 pulse-layer" />
          <div className="relative w-32 h-32 bg-surface-container-low rounded-sm overflow-hidden flex items-center justify-center group">
            <div className="scanner-line absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <Loader2 className="w-16 h-16 text-primary opacity-80 animate-spin" />

            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/40" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/40" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-primary/40" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-primary/40" />
          </div>
        </div>

        <div className="text-center space-y-6">
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-[-0.03em] uppercase text-primary">
            Finding your matches&hellip;
          </h1>
          <div className="flex flex-col items-center space-y-2 opacity-60">
            <p className="font-label text-xs tracking-[0.2em] uppercase font-semibold">
              Analyzing Intent & Chemistry
            </p>
            <div className="h-[1px] w-8 bg-outline-variant" />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-12 w-full px-8">
            {['Scanning curated venues', 'Matching social blueprints', 'Finalizing guest list'].map((text, i) => (
              <div key={i} className="bg-surface-container-low p-4 flex items-center gap-4 group">
                <div className="w-2 h-2 bg-primary/40 group-hover:bg-primary transition-colors" />
                <p className="font-body text-sm tracking-tight text-on-surface-variant">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 z-10 text-center">
        <p className="font-headline font-black text-lg tracking-tighter uppercase text-on-surface/20">
          SHOWUP
        </p>
      </div>

      <div className="absolute top-12 left-12 hidden md:block">
        <div className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-outline">
          <span className="w-6 h-[1px] bg-outline-variant" />
          <span>System Status: Online</span>
        </div>
      </div>
      <div className="absolute top-12 right-12 hidden md:block">
        <div className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-outline">
          <span>Ref: 902-X-MATCH</span>
          <span className="w-6 h-[1px] bg-outline-variant" />
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <div
          className="w-full h-full bg-repeat"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0XnE1GOTxTHBuYuL3mpWiwKn2dx9nffU3H3IfaxaeKFtX1TzngX0xEqfIHxat0nZlwSG3GEZEqhAMRcno27RG1TfMxzAUs4o055-ZTk66QZ2NIWQD5FaKopVabkrVlL1_GXo8fPB4L0NvlcQ1Wz8vT433VE_1uvoDDOifBxMVD41N9ebhmelqyCRblAD2fRCNVuHY2xryDK3DfPlvBjAp1U0y-2xgBwgEhx6OQY_TV-u65eiN-jdttA5VQGJHOqhXPlM5Fy037o4H')" }}
        />
      </div>
    </main>
  );
}
