import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | ShowUp',
  description: 'How ShowUp handles your data.',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <p>
            This is a placeholder privacy policy for development. Before launch, replace this page with a
            policy drafted for Indian law (including applicable data protection rules), your actual data
            practices, and ShowUp&apos;s product behavior (phone number, profile data, photos, location at
            meetup, and third-party services such as Supabase and hosting).
          </p>
          <p>
            Contact: add a support email or campus contact here when available.
          </p>
        </div>
      </div>
    </div>
  );
}
