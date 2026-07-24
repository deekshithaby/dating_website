import { Button } from '@/components/button';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body antialiased flex items-center justify-center px-6">
      <section className="max-w-4xl w-full text-center relative">
        <div className="mb-8 inline-block">
          <span className="text-primary font-label text-xs tracking-[0.4em] uppercase py-2 px-4 bg-surface-container-high rounded-full">
            The Anti-Swipe Experience
          </span>
        </div>

        <h1 className="font-headline font-black text-5xl md:text-8xl text-on-surface tracking-tighter leading-[0.9] mb-8 text-glow">
          REAL MATCHES.<br />
          <span className="text-primary">SHOW UP</span> OR<br />
          MISS OUT.
        </h1>

        <p className="font-body text-lg md:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
          No swiping. No infinite scrolls. We curate the connection; you provide the presence.
        </p>

        <Link href="/login" className="inline-block">
          <Button size="lg" className="px-10">Get Started</Button>
        </Link>

        <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[10%] left-[-10%] w-[30vw] h-[30vw] bg-surface-container-high/20 rounded-full blur-[100px] pointer-events-none" />
      </section>
    </div>
  );
}
