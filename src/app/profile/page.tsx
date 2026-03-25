'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Shield, FileText, Smartphone } from 'lucide-react';

export default function Profile() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-on-surface pb-32">
      <header className="fixed top-0 w-full z-50 bg-[#131313] flex items-center justify-between px-6 h-16">
        <button onClick={() => router.back()} className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">Profile</h1>
        <Settings className="w-6 h-6 text-primary" />
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto space-y-12">
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full border-2 border-primary p-1">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv1wjE4wijFMWvQOjCzZmKnkXONvKV47Xni2Zyzhw1664WaWNYM6_NLW3YWmzbfyBlAxynSfBalXa_7FT3gViX5x_svUMTsrT-4IGsSO6hLtyo7yEURJdg-01j7kKKKSLpXhou-jx2U74zCmGHgn69Y3dsLzCG8-SxpL2OXJEKSvumKNAnRKbWQwiYbDVAz2hils3QzhU8zaZNmBnmPZ0WqtCt8cgJ5KvafKwIyQ-8Oqur6L0R3NBvpF_8of9ZNU-zAldMNOIknVw5"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-headline font-black uppercase tracking-tight">Alex, 29</h2>
            <p className="text-primary font-label text-xs uppercase tracking-widest font-bold">Member since 2024</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-sm space-y-2">
            <p className="text-[10px] uppercase font-bold text-outline tracking-widest">Accountability</p>
            <p className="text-2xl font-headline font-black text-primary">940</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-sm space-y-2">
            <p className="text-[10px] uppercase font-bold text-outline tracking-widest">Encounters</p>
            <p className="text-2xl font-headline font-black text-tertiary">12</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-label text-xs uppercase tracking-[0.3em] text-primary font-bold">Preferences</h3>
          <div className="space-y-2">
            {[
              { icon: Shield, label: 'Safety Protocol', value: 'Verified' },
              { icon: FileText, label: 'Ethics Agreement', value: 'Signed' },
              { icon: Smartphone, label: 'Phone Number', value: '+1 ••• ••• 4421' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-sm">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-on-surface-variant" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-xs text-primary font-bold uppercase tracking-widest">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
