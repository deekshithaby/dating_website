'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Info, Lock } from 'lucide-react';
import { Button } from '@/components/button';

export default function MeetupVerification() {
  const router = useRouter();

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <header className="fixed top-0 w-full z-50 bg-[#131313] flex items-center justify-between px-6 h-16">
        <button onClick={() => router.back()} className="text-primary active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">ShowUp</h1>
        <div className="w-10" />
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto min-h-screen flex flex-col">
        <section className="mb-12">
          <h2 className="font-headline text-4xl font-extrabold leading-none tracking-tight text-on-surface mb-2">
            Arrived? Let&apos;s verify.
          </h2>
          <p className="text-secondary font-body text-lg opacity-80">Verification in progress</p>
        </section>

        <section className="mb-16 flex flex-col items-center">
          <div className="text-primary font-headline text-[5rem] leading-none font-black tracking-tighter mb-2">
            15:00
          </div>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-outline">until meetup</p>
        </section>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-surface-container-low p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase font-bold text-outline">Your Status</span>
              <CheckCircle2 className="text-tertiary w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="font-headline text-xl text-on-surface">Verified</p>
              <p className="text-xs text-tertiary font-medium">Inside 50m radius</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase font-bold text-outline">Match Status</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mt-2" />
            </div>
            <div>
              <p className="font-headline text-xl text-on-surface">Searching...</p>
              <p className="text-xs text-outline font-medium">Awaiting GPS signal</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high p-8 mb-12 border-l-2 border-primary">
          <div className="flex items-start gap-4">
            <Info className="text-primary w-6 h-6 mt-1" />
            <p className="text-on-surface-variant font-body leading-relaxed">
              Keep your GPS on and stay within 50m of the venue to unlock the photo reveal.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            onClick={() => router.push('/reveal')}
            variant="secondary"
            className="w-full py-5 flex items-center justify-center gap-3"
          >
            <Lock className="w-4 h-4" />
            Reveal Photo
          </Button>
          <p className="text-center text-[10px] uppercase text-outline mt-4 tracking-widest font-bold">
            Verification required for both parties
          </p>
        </div>
      </main>

      <div className="fixed inset-0 -z-10 opacity-10">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnPj0H91c2XOdf6m_LKVERL8HPs42k45MmZZ9qdRux8Efr8VtCDrxy4wcH5LLMP_wKIJ6USdJJSLFHpmkwgPIj3baqHPwG2-Omisa0neTqtgTOAuFvjF13IO9Pc1PGlq5wtP8SeRIUsogCkCRV5TnePMepytVsM_qUt3nHqJYkEFsnPS7eTYer1l48RYx8vSGr_KRxMImtdMFJ1YwkHRUbDJQfAPPtttCLxVFSNnHI30w4c8otUGOpWWlsIfNF7KA7BM5bf7O3Yxed"
          alt="Map"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
    </div>
  );
}
