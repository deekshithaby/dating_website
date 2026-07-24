import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | ShowUp',
  description: 'Terms for using ShowUp.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/login"
          className="inline-block text-sm font-label uppercase tracking-widest text-primary hover:opacity-80 mb-10"
        >
          ← Back
        </Link>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <p>
            This is a placeholder terms of service for development. Before launch, replace this page with
            terms that cover eligibility (e.g. campus community), acceptable use, meetup and payment rules,
            account suspension, limitation of liability, and governing law appropriate for your jurisdiction.
          </p>
          <p>
            Contact: add a support email or campus contact here when available.
          </p>
        </div>
      </div>
    </div>
  );
}
