'use client';

import { useRouter } from 'next/navigation';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/button';

export default function OTP() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-6 h-20 w-full bg-surface">
        <div className="font-headline font-black tracking-[-0.05em] text-2xl text-primary uppercase">
          SHOWUP
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high"
        >
          <X className="w-6 h-6 text-on-surface-variant" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter uppercase text-on-surface leading-none">
              Verify Identity
            </h1>
            <p className="text-on-surface-variant font-body text-base max-w-[280px] mx-auto leading-relaxed opacity-80">
              We sent a 4-digit code to your registered mobile number.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <input
                key={i}
                className="w-16 h-20 text-center text-3xl font-headline font-bold bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-sm text-primary placeholder:text-surface-container-highest transition-all duration-200"
                maxLength={1}
                placeholder="&#8226;"
                type="number"
                autoFocus={i === 1}
              />
            ))}
          </div>

          <div className="space-y-8 flex flex-col items-center">
            <Button
              onClick={() => router.push('/photo-upload')}
              className="w-full py-5"
            >
              Verify Code
            </Button>

            <div className="flex flex-col items-center space-y-2">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-surface-container-highest font-semibold">
                Didn&apos;t receive it?
              </p>
              <button className="text-primary font-body text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                Resend code
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <footer className="p-8 flex justify-center opacity-20 pointer-events-none">
        <div className="h-[2px] w-12 bg-on-surface rounded-full" />
      </footer>
    </div>
  );
}
