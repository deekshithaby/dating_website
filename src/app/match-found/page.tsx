'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Timer, LockOpen, MapPin } from 'lucide-react';
import { Button } from '@/components/button';

export default function MatchFound() {
  const router = useRouter();

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-[#131313] flex items-center justify-between px-6 h-16">
        <button onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">ShowUp</h1>
        <div className="w-6" />
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto min-h-screen flex flex-col gap-8">
        <section className="flex flex-col items-center text-center space-y-2">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] font-label">Action Required</span>
          <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Match Found!</h2>
          <div className="flex items-center gap-2 text-primary-container">
            <Timer className="w-5 h-5 fill-current" />
            <span className="font-headline text-xl font-bold tracking-tight">12m 45s</span>
          </div>
        </section>

        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-surface-container-lowest">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsyeDEjfwrfmHCn-LCjGxLGEoqR1rqQsqs6gTwHR8kXaPt4Gf4C3sYEqKzdq2deJ0CBTjOx04ZcbmDEcb42bv5FBD6zCGfRM7h7eDp1A6E7meWuUV_1oSkPk5nsb7Uc7IqZJivSyxofn6HrDYScwUe_WsByZ-1fmo4o1kB7SAY2X6OK6TQJvqgeaUX93YgNX2HaWQHOC-pDGjZm5F6Ve9iARLoJMiPTT4Abt66z8k8OHHvHvnIByuG2NwMwV0SI7udb-lpbvd0w5Cz"
            alt="Blurred silhouette"
            className="w-full h-full object-cover filter blur-[40px] brightness-[0.4] scale-110"
          />
          <div className="absolute inset-0 glass-overlay flex flex-col justify-end p-8">
            <div className="space-y-6">
              <div>
                <p className="text-primary font-bold uppercase text-[10px] tracking-widest mb-1 font-label">The Meeting Point</p>
                <h3 className="font-headline text-3xl font-bold leading-none text-on-surface">The Alibi Bar, Downtown</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high/40 backdrop-blur-md p-4 rounded-sm">
                  <p className="text-on-surface-variant uppercase text-[9px] font-bold tracking-widest mb-1">Date</p>
                  <p className="font-headline text-lg font-bold text-on-surface">Oct 24th</p>
                </div>
                <div className="bg-surface-container-high/40 backdrop-blur-md p-4 rounded-sm">
                  <p className="text-on-surface-variant uppercase text-[9px] font-bold tracking-widest mb-1">Time</p>
                  <p className="font-headline text-lg font-bold text-on-surface">8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="bg-surface-container-low p-6 rounded-sm text-center">
            <p className="text-on-surface-variant font-medium leading-relaxed italic">
              &quot;First to lock in gets the match. Arrival reveals the identity.&quot;
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push('/meetup')}
              className="w-full h-16 bg-primary-container hover:bg-primary-container/90 text-on-primary font-black text-xl"
            >
              Lock In Match
              <LockOpen className="w-6 h-6" />
            </Button>
            <Button variant="secondary" className="w-full h-14">
              Pass This Time
            </Button>
          </div>
        </section>

        <section className="mt-4 opacity-60">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-label uppercase tracking-widest">Downtown District</span>
          </div>
        </section>
      </main>
    </div>
  );
}
