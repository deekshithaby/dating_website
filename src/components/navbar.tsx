import Link from 'next/link';
import { User } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313] flex items-center justify-between px-6 h-16">
      <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">
        ShowUp
      </Link>
      <nav className="hidden md:flex gap-8 items-center">
        <Link href="/process" className="text-gray-500 hover:text-primary transition-colors duration-300 font-body text-sm tracking-widest uppercase">Process</Link>
        <Link href="/philosophy" className="text-gray-500 hover:text-primary transition-colors duration-300 font-body text-sm tracking-widest uppercase">Philosophy</Link>
        <Link href="/membership" className="text-gray-500 hover:text-primary transition-colors duration-300 font-body text-sm tracking-widest uppercase">Membership</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <User className="w-6 h-6 text-primary" />
        </Link>
      </div>
    </header>
  );
};
