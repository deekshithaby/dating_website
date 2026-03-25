'use client';

import { useRouter } from 'next/navigation';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/button';

export default function Login() {
  const router = useRouter();

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24">
        <div className="mb-16">
          <h1 className="font-headline font-black text-2xl tracking-[-0.05em] text-primary uppercase">
            SHOWUP
          </h1>
        </div>

        <div className="max-w-md w-full">
          <header className="mb-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
              Welcome back.
            </h2>
            <p className="text-on-surface-variant font-body text-lg leading-relaxed opacity-80">
              Enter your phone number to access your exclusive community.
            </p>
          </header>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); router.push('/otp'); }}>
            <div className="relative group">
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-primary mb-2 transition-all duration-300 group-focus-within:translate-x-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border-b border-outline-variant/30 text-on-surface text-2xl font-body py-4 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-container-highest"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
                <div className="absolute right-0 bottom-4 text-on-surface-variant opacity-40">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full py-5 text-base">
                Send OTP
              </Button>
            </div>
          </form>

          <footer className="mt-12">
            <p className="text-[10px] font-label font-semibold text-on-surface-variant/50 uppercase tracking-[0.2em] leading-loose">
              By continuing, you agree to our <a href="#" className="text-on-surface underline decoration-outline-variant/50 hover:text-primary transition-colors">Privacy Policy</a> and <a href="#" className="text-on-surface underline decoration-outline-variant/50 hover:text-primary transition-colors">Terms of Service</a>.
            </p>
          </footer>
        </div>
      </main>

      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[30vw] h-[30vw] bg-surface-container-high/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
