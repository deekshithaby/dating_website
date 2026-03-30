import { Button } from '@/components/button';
import { Bell, Timer, Ban, Sparkles, Mail, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center px-6 py-24 hero-gradient overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCul04FNIjYQRQN568eGThz3gq7p9iO5pvZ7G_7doSt5ngL6wZjcLBSdtKAscaXYovdt0_EGM1jJiIV7tcxgcI5MN1OADU77UTW1GOuJ5KhrM_yU000u7nVDSRKBJz893aQHajzbZkAnrkKPgcQVy4ievHiaLtBCcWagBOSaI2wKqQt7NCYhvLNIolm11FSEFsasxJVTKK2rYsy8q1vJcLxgs94yE_b4pvIv-j6FKTaGN43ivbem9v49K4y9e6QA5VYPBpsB2hnfVfe')" }}
        />

        <div className="max-w-5xl w-full flex flex-col items-center text-center relative z-10">
          <div className="mb-8 inline-block">
            <span className="text-primary font-label text-xs tracking-[0.4em] uppercase py-2 px-4 bg-surface-container-high rounded-full">
              The Anti-Swipe Experience
            </span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-8xl lg:text-9xl text-on-surface tracking-tighter leading-[0.9] mb-8 text-glow">
            REAL MATCHES.<br/>
            <span className="text-primary">SHOW UP</span> OR<br/>
            MISS OUT.
          </h1>

          <p className="font-body text-lg md:text-2xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
            No swiping. No infinite scrolls. We curate the connection; you provide the presence. The concierge for your romantic intent.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Link href="/login">
              <Button size="lg" className="w-full md:w-auto">Get Started</Button>
            </Link>
            <Link
              href="/login"
              className="w-full md:w-auto inline-flex items-center justify-center text-sm font-label font-semibold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Button variant="secondary" size="lg" className="w-full md:w-auto">View Ethics</Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="flex flex-col gap-2">
            <div className="h-px w-24 bg-primary/30"></div>
            <span className="font-label text-[10px] uppercase tracking-widest text-primary/50">Est. MMXXIV</span>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-surface-container-low py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Feature 1 */}
            <div className="md:col-span-8 bg-surface-container-high p-12 rounded-lg flex flex-col justify-between min-h-[400px]">
              <div>
                <span className="text-primary mb-6 block">
                  <Bell size={40} />
                </span>
                <h3 className="font-headline text-4xl font-bold tracking-tight mb-4">The Concierge Method</h3>
                <p className="font-body text-lg text-on-surface-variant max-w-md">
                  Our algorithm doesn&apos;t track likes; it predicts chemistry. We present one meaningful match at a time, removing the noise of the digital marketplace.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS2C8gCJpY_mK0FXNJoQXFZIMij5rwKOs0uuWdjIXA6FHmzBksaMwnyYbTuaqhtT7K2rl1nhI-B-fwG1zxCscarJKNoJCmmju98dxCxJibyGl6Amb_vzatNG_xnEKWcTzX3wPRPn6TEpipCsd0PBsIHzPHTtHzL8o8_cEL6bgTStRQ20k-CYy8hjvJ_UrogjHuWMb6cqEgZGzHauMO02MtufNHes6Zz0NUBYMzJDsbLvhNN7aaEVDv6pg3Lu7JuCtG7lgycQLr-GYV" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-tertiary">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmE6efMg04OW6qZUOA646OB9MEJCyWIoSGxatwAKS20528eHo3vdk1ZZS-qrNYqMIZ6UAnPA4U2soxtzHk36e7-Yak_8XxrCs7HxRZe2VU7ue2XYIh82oFNaGEKSoJc901PWEpOmmHxCJhM0rKMNRBIkaGp6qhnrbLFrVtfKb1hkPhnMLdoxzrt3NPbWghrF68IJX8n73jYJAsR0k2kN1i4VHFDJkQLG9Dhpx2Rh1P84eyzPlTabRyX7SRUkGV9NNI5nkTzLnGe2KY" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-sm font-label text-on-surface-variant italic">98% Arrival Rate this week</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-4 bg-primary text-on-primary p-12 rounded-lg flex flex-col justify-center text-center">
              <span className="flex justify-center mb-6">
                <Timer size={64} fill="currentColor" />
              </span>
              <h3 className="font-headline text-3xl font-black mb-4">SHOW UP.</h3>
              <p className="font-body font-bold text-sm uppercase tracking-widest mb-8">Accountability is our core currency.</p>
              <div className="bg-on-primary/10 p-4 rounded-sm">
                <p className="text-xs leading-relaxed opacity-80 italic">
                  &quot;Missing a confirmed meeting results in immediate membership suspension. We value time above all.&quot;
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-4 bg-surface-container-highest p-10 rounded-lg">
              <h4 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
                <Ban className="text-error w-5 h-5" />
                Zero Swipe Policy
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Eliminate the dopamine loop. We&apos;ve replaced the slot-machine mechanic with intentional, editorial-style profiles.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-8 bg-surface-container p-10 rounded-lg flex items-center justify-between group overflow-hidden relative">
              <div className="z-10">
                <h4 className="font-headline text-3xl font-bold mb-2">Designed for Intent.</h4>
                <p className="text-on-surface-variant max-w-sm">
                  An interface that recedes so the conversation can take center stage. No gamification. Just connection.
                </p>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 transform translate-x-1/4 group-hover:translate-x-0 transition-transform duration-700">
                <Sparkles size={200} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 flex flex-col items-center justify-center text-center bg-background">
        <h2 className="font-headline text-4xl md:text-6xl font-black mb-12 tracking-tighter">READY TO EXIT THE LOOP?</h2>
        <Link href="/onboarding">
          <Button size="xl" className="group relative overflow-hidden">
            <span className="relative z-10">Apply for Membership</span>
            <div className="absolute inset-0 bg-primary-container translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </Link>
        <p className="mt-8 font-label text-xs uppercase tracking-[0.5em] text-on-surface-variant">
          Membership is currently invitation-only.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-16 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-3xl font-black uppercase tracking-tighter text-primary font-headline">
              ShowUp
            </div>
            <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
              A private digital social club dedicated to the restoration of real-world romantic encounters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Platform</span>
              <a href="#" className="text-sm hover:text-primary transition-colors">Manifesto</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Safety Protocol</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Press</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
              <a href="#" className="text-sm hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Code of Conduct</a>
            </div>
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Connect</span>
              <div className="flex gap-4">
                <Mail className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
                <Share2 className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
          <span>&copy; 2024 SHOWUP TECHNOLOGIES INC.</span>
          <span>Handcrafted for the Intentional.</span>
        </div>
      </footer>
    </div>
  );
}
