'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { BottomNav } from '@/components/bottom-nav';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {isLanding && <Navbar />}
      {children}
      <BottomNav />
    </div>
  );
}
