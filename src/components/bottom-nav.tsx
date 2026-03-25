'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Timer, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Compass, label: 'Explore', path: '/' },
    { icon: Timer, label: 'Meetup', path: '/meetup' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const suppressedRoutes = ['/onboarding', '/otp', '/photo-upload', '/finding-matches', '/reveal'];
  if (suppressedRoutes.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-8 pb-safe bg-[#131313]/80 backdrop-blur-3xl z-50 shadow-[0_-4px_40px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path === '/meetup' && pathname === '/match-found');

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all",
              isActive ? "text-primary scale-110" : "text-gray-600 hover:text-white"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="text-[10px] uppercase font-bold font-body mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
