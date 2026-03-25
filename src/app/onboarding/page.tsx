'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>('Extrovert');

  const options = [
    { id: 'Introvert', label: 'Introvert', sub: 'Values Deep Connection' },
    { id: 'Extrovert', label: 'Extrovert', sub: 'Values Social Energy' },
    { id: 'Ambivert', label: 'Ambivert', sub: 'Values Balance' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#131313]">
        <button onClick={() => router.back()} className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">ShowUp</h1>
        <div className="w-6" />
      </header>

      <main className="w-full max-w-xl px-6 pt-24 pb-32 flex-grow flex flex-col justify-center">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] uppercase font-bold font-label tracking-widest text-primary">Phase 01 / 04</span>
            <span className="text-[10px] uppercase font-bold font-label tracking-widest text-on-surface-variant">Personality & Compatibility</span>
          </div>
          <div className="h-[2px] w-full bg-surface-container-high overflow-hidden">
            <div className="h-full bg-primary w-[25%]" />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold font-headline leading-tight tracking-tight mb-4 text-on-surface">
            What best describes your values and communication style?
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed font-body opacity-80">
            This helps our concierge curate encounters that align with your natural rhythm.
          </p>
        </section>

        <div className="space-y-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "w-full text-left p-6 transition-all duration-300 flex items-center justify-between",
                selected === opt.id
                  ? "bg-surface-container-high border-l-2 border-primary"
                  : "bg-surface-container-low hover:bg-surface-container-high group"
              )}
            >
              <div>
                <h3 className={cn(
                  "text-lg font-bold font-headline transition-colors",
                  selected === opt.id ? "text-primary" : "text-on-surface group-hover:text-primary"
                )}>
                  {opt.label}
                </h3>
                <p className="text-on-surface-variant font-body">{opt.sub}</p>
              </div>
              {selected === opt.id ? (
                <CheckCircle2 className="text-primary w-6 h-6 fill-current" />
              ) : (
                <div className="w-6 h-6 border border-outline-variant/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-transparent group-active:bg-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-6 bg-surface/90 backdrop-blur-xl flex flex-col gap-4">
        <Button
          onClick={() => router.push('/login')}
          className="w-full h-14"
        >
          Next
        </Button>
        <p className="text-center text-[10px] uppercase font-bold text-gray-600 tracking-tighter">
          Curating your experience...
        </p>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-20 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
