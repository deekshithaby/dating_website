'use client';

import { Menu, Verified, Handshake, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/button';

export default function Reveal() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <header className="bg-[#131313] flex justify-between items-center px-6 h-20 w-full fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="text-primary cursor-pointer hover:opacity-80 transition-opacity" />
        </div>
        <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl font-black text-primary">SHOWUP</h1>
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden active:scale-95 duration-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv1wjE4wijFMWvQOjCzZmKnkXONvKV47Xni2Zyzhw1664WaWNYM6_NLW3YWmzbfyBlAxynSfBalXa_7FT3gViX5x_svUMTsrT-4IGsSO6hLtyo7yEURJdg-01j7kKKKSLpXhou-jx2U74zCmGHgn69Y3dsLzCG8-SxpL2OXJEKSvumKNAnRKbWQwiYbDVAz2hils3QzhU8zaZNmBnmPZ0WqtCt8cgJ5KvafKwIyQ-8Oqur6L0R3NBvpF_8of9ZNU-zAldMNOIknVw5"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="min-h-screen pt-24 pb-32 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 reveal-gradient pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-tertiary-container/5 blur-[120px] rounded-full" />

        <div className="max-w-md w-full z-10 space-y-12">
          <div className="text-center space-y-4">
            <span className="font-label text-primary text-xs tracking-[0.3em] uppercase font-bold">The Reveal</span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter leading-none text-on-surface">
              You both showed up. <br/>
              <span className="text-primary-container">Here&apos;s your match.</span>
            </h2>
            <p className="font-body text-on-surface-variant text-lg tracking-wide opacity-80">
              The encounter begins.
            </p>
          </div>

          <div className="relative group">
            <div className="aspect-[4/5] w-full rounded-lg overflow-hidden photo-glow border border-primary/10 bg-surface-container-low transition-transform duration-700 hover:scale-[1.02]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACBWfpfE1IWe6AEPwxLijpt3B9E15xWbupABIkozxw5ntXlMDUquR5HrtA_z9i1avQu8irOWCi6vcJkbebHvHxPSAvbWIoOJxPgROKr2AuXhJiZcHXND36jfixoMAoITEmXGmJ7wykB766QqpOQLr3l-2Je0XGcOgEaoMgrmU9EPWavheAEG3rgmhMYqxKfUVv_WZOz2qew79BE9IVx1pXpO4u9-UHHgyqZil1NPCy7W8nLOCcTrUCLiesXAuDlaG8hlU5BLCnfNBT"
                alt="Match portrait"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/40 to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-headline text-3xl font-bold tracking-tight text-white">Elena, 27</h3>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      <Verified className="w-4 h-4 fill-current" />
                      Confirmed Attendee
                    </div>
                  </div>
                  <div className="bg-primary/20 backdrop-blur-md px-3 py-1 rounded-sm border border-primary/20">
                    <span className="text-primary font-label text-[10px] font-bold uppercase tracking-widest">98% Match</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface-container-highest p-4 rounded-lg shadow-2xl border border-outline-variant/20 rotate-12">
              <Handshake className="text-tertiary w-8 h-8" />
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <Sparkles className="text-primary w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="font-body text-on-surface leading-relaxed">
                  &quot;Elena values punctuality and deep conversations over morning coffee. You both mentioned a love for Brutalist architecture.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full py-5 flex items-center justify-center gap-3 group">
              MESSAGE THEM
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-surface-container-highest px-6 py-3 rounded-full border border-outline-variant/20 shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Accountability Score +50</span>
      </div>
    </div>
  );
}
