'use client';

import { useRouter } from 'next/navigation';
import { X, Camera, CheckCircle2, Ban } from 'lucide-react';
import { Button } from '@/components/button';

export default function PhotoUpload() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <nav className="flex justify-between items-center px-6 h-20 w-full bg-[#131313] fixed top-0 z-50">
        <button onClick={() => router.back()} className="hover:opacity-80 transition-opacity active:scale-95 duration-200 text-gray-500">
          <X className="w-6 h-6" />
        </button>
        <div className="font-headline font-bold tracking-tighter uppercase text-2xl font-black tracking-[-0.05em] text-primary">
          SHOWUP
        </div>
        <div className="w-10" />
      </nav>

      <main className="min-h-screen flex flex-col pt-24 pb-12 px-6 max-w-xl mx-auto">
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">
            Verify Your<br/><span className="text-primary">Identity</span>
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed opacity-80">
            To keep the community safe and authentic, we require a clear verification photo. This won&apos;t be visible on your main profile.
          </p>
        </header>

        <section className="flex-grow flex flex-col">
          <div className="relative w-full aspect-[4/5] bg-surface-container-low rounded-lg flex items-center justify-center p-4 group cursor-pointer transition-all duration-300">
            <div className="absolute inset-4 rounded-lg dashed-border opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center text-center px-8 z-10">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8" />
              </div>
              <h2 className="font-headline text-lg font-bold mb-2">Upload a clear photo of your face</h2>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60">Tap to browse or drag & drop</p>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/5 to-transparent opacity-30 rounded-lg" />
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-4">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Guidelines for approval</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-4 h-4 fill-current" />
                  <span className="text-xs font-medium text-on-surface-variant">Good lighting</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-4 h-4 fill-current" />
                  <span className="text-xs font-medium text-on-surface-variant">Face visible</span>
                </div>
              </div>
              <div className="pt-2">
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-on-surface-variant/60">
                    <Ban className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-body">No masks, no sunglasses, no filters</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant/60">
                    <Ban className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-body">No group photos or distant shots</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 sticky bottom-0 bg-surface/80 backdrop-blur-md pt-4 pb-4">
          <Button
            onClick={() => router.push('/finding-matches')}
            className="w-full py-5"
          >
            Continue
          </Button>
          <p className="text-center mt-4 text-[10px] text-on-surface-variant opacity-40 uppercase tracking-tighter">
            Your data is encrypted and used for verification only.
          </p>
        </footer>
      </main>
    </div>
  );
}
