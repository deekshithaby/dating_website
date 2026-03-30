'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/button';
import { createClient } from '@/lib/supabase/client';

export default function OTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const phone = searchParams.get('phone') ?? '';
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    setCountdown(60);
  }, [phone]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Invalid phone number. Please go back and try again.');
      return;
    }

    const token = otp.join('');
    if (!/^\d{6}$/.test(token)) {
      setError('Enter the 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: 'sms',
    });

    if (verifyError || !data.user) {
      setIsLoading(false);
      setError(verifyError?.message ?? 'Could not verify OTP.');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', data.user.id)
      .maybeSingle();

    setIsLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    if (profile?.onboarding_complete) {
      router.push('/profile');
      return;
    }

    router.push('/onboarding');
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Invalid phone number. Please go back and try again.');
      return;
    }

    setIsLoading(true);
    const { error: resendError } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });
    setIsLoading(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setCountdown(60);
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-6 h-20 w-full bg-surface">
        <div className="font-headline font-black tracking-[-0.05em] text-2xl text-primary uppercase">
          SHOWUP
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high"
        >
          <X className="w-6 h-6 text-on-surface-variant" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter uppercase text-on-surface leading-none">
              Verify Identity
            </h1>
            <p className="text-on-surface-variant font-body text-base max-w-[280px] mx-auto leading-relaxed opacity-80">
              We sent a 4-digit code to your registered mobile number.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                className="w-16 h-20 text-center text-3xl font-headline font-bold bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-sm text-primary placeholder:text-surface-container-highest transition-all duration-200"
                maxLength={1}
                placeholder="&#8226;"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp[i]}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '').slice(-1);
                  setOtp((prev) => {
                    const nextOtp = [...prev];
                    nextOtp[i] = next;
                    return nextOtp;
                  });

                  if (next && i < 5) {
                    inputRefs.current[i + 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Backspace') return;
                  if (otp[i] !== '') return;
                  if (i <= 0) return;
                  inputRefs.current[i - 1]?.focus();
                }}
                autoFocus={i === 0}
              />
            ))}
          </div>
          {error ? (
            <p className="text-sm text-red-500 text-center">{error}</p>
          ) : null}

          <div className="space-y-8 flex flex-col items-center">
            <Button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full py-5"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="flex flex-col items-center space-y-2">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-surface-container-highest font-semibold">
                Didn&apos;t receive it?
              </p>
              <button
                onClick={handleResend}
                disabled={countdown > 0 || isLoading}
                className="text-primary font-body text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend code
                <RefreshCw className="w-4 h-4" />
              </button>
              {countdown > 0 ? (
                <p className="text-xs text-on-surface-variant/70">{countdown}s</p>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <footer className="p-8 flex justify-center opacity-20 pointer-events-none">
        <div className="h-[2px] w-12 bg-on-surface rounded-full" />
      </footer>
    </div>
  );
}
