'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/button';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>('Extrovert');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const options = [
    { id: 'Introvert', label: 'Introvert', sub: 'Values Deep Connection' },
    { id: 'Extrovert', label: 'Extrovert', sub: 'Values Social Energy' },
    { id: 'Ambivert', label: 'Ambivert', sub: 'Values Balance' },
  ];

  const quizQuestions = [
    {
      id: 'q1',
      question: 'How do you spend a free Sunday?',
      options: ['Outdoors', 'Gaming & Netflix', 'Social hangout', 'Reading & creating'],
    },
    {
      id: 'q2',
      question: 'Your ideal relationship pace?',
      options: ['Slow and steady', 'Medium', 'Fast', 'Go with the flow'],
    },
    {
      id: 'q3',
      question: 'What matters most in a partner?',
      options: ['Ambition', 'Humor', 'Kindness', 'Intelligence'],
    },
    {
      id: 'q4',
      question: 'How often hang out with a partner?',
      options: ['Daily', 'Few times a week', 'Weekends only', 'Flexible'],
    },
    {
      id: 'q5',
      question: 'Your communication style?',
      options: ['Text constantly', 'Occasional check-ins', 'Only when needed', 'Video calls'],
    },
    {
      id: 'q6',
      question: 'Night out or night in?',
      options: ['Always out', 'Usually out', 'Usually in', 'Always in'],
    },
    {
      id: 'q7',
      question: 'How important is shared values?',
      options: ['Very important', 'Somewhat', 'Not important', 'Open to anything'],
    },
    {
      id: 'q8',
      question: 'Your future goal?',
      options: ['Career first', 'Relationship first', 'Both equally', 'Still figuring out'],
    },
  ];

  const currentQuiz = quizQuestions[quizStep];
  const progressWidth = `${(step / 4) * 100}%`;
  const stepSubtitle = useMemo(() => {
    if (step === 1) return 'Personality & Compatibility';
    if (step === 2) return 'Basic Profile Setup';
    if (step === 3) return 'Compatibility Quiz';
    return 'Finalizing Your Profile';
  }, [step]);

  useEffect(() => {
    const saveOnFinalStep = async () => {
      if (step !== 4 || isSaved) return;

      setIsSaving(true);
      setSaveError('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setIsSaving(false);
        setSaveError(userError?.message ?? 'Could not fetch authenticated user.');
        return;
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        phone: user.phone,
        display_name: displayName.trim(),
        age: Number(age),
        gender: gender.toLowerCase(),
        bio: bio.trim(),
        onboarding_complete: true,
      });

      if (profileError) {
        console.log(profileError);
        setIsSaving(false);
        setSaveError(profileError.message);
        return;
      }

      const { error: quizError } = await supabase.from('quiz_responses').upsert({
        user_id: user.id,
        responses: { personality: selected, ...quizAnswers },
      });

      if (quizError) {
        console.log(quizError);
        setIsSaving(false);
        setSaveError(quizError.message);
        return;
      }

      setIsSaving(false);
      setIsSaved(true);
    };

    void saveOnFinalStep();
  }, [age, bio, displayName, gender, isSaved, quizAnswers, selected, step, supabase]);

  const canGoNext = () => {
    if (step === 1) return Boolean(selected);
    if (step === 2) {
      const trimmedName = displayName.trim();
      const parsedAge = Number(age);
      return (
        trimmedName.length >= 2 &&
        trimmedName.length <= 30 &&
        Number.isFinite(parsedAge) &&
        parsedAge >= 18 &&
        parsedAge <= 30 &&
        (gender === 'Male' || gender === 'Female') &&
        bio.trim().length <= 300
      );
    }
    if (step === 3) return Boolean(quizAnswers[currentQuiz.id]);
    return false;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep((prev) => prev + 1);
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step === 3 && quizStep > 0) {
      setQuizStep((prev) => prev - 1);
      return;
    }
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#131313]">
        <button onClick={handleBack} className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary font-headline">ShowUp</h1>
        <div className="w-6" />
      </header>

      <main className="w-full max-w-xl px-6 pt-24 pb-32 flex-grow flex flex-col justify-center">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] uppercase font-bold font-label tracking-widest text-primary">Phase {String(step).padStart(2, '0')} / 04</span>
            <span className="text-[10px] uppercase font-bold font-label tracking-widest text-on-surface-variant">{stepSubtitle}</span>
          </div>
          <div className="h-[2px] w-full bg-surface-container-high overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: progressWidth }} />
          </div>
        </div>

        {step === 1 ? (
          <>
            <section className="mb-12">
              <h2 className="text-3xl font-bold font-headline leading-tight tracking-tight mb-4 text-on-surface">
                What best describes your values and communication style?
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed font-body opacity-80">
                This helps our concierge curate encounters that align with your natural rhythm.
              </p>
            </section>

            <div className="space-y-4">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "w-full text-left p-6 transition-all duration-300 flex items-center justify-between",
                    selected === opt.id
                      ? "bg-surface-container-high border-l-2 border-primary"
                      : "bg-surface-container-low hover:bg-surface-container-high group"
                  )}
                >
                  <div>
                    <h3 className={cn(
                      "text-lg font-bold font-headline transition-colors",
                      selected === opt.id ? "text-primary" : "text-on-surface group-hover:text-primary"
                    )}>
                      {opt.label}
                    </h3>
                    <p className="text-on-surface-variant font-body">{opt.sub}</p>
                  </div>
                  {selected === opt.id ? (
                    <CheckCircle2 className="text-primary w-6 h-6 fill-current" />
                  ) : (
                    <div className="w-6 h-6 border border-outline-variant/30 flex items-center justify-center">
                      <div className="w-2 h-2 bg-transparent group-active:bg-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold font-headline leading-tight tracking-tight mb-4 text-on-surface">
                Tell us about yourself.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed font-body opacity-80">
                This profile stays private until your verified meetup.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-primary mb-2">
                  Display Name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  type="text"
                  className="w-full bg-surface-container-low border-b border-outline-variant/30 text-on-surface text-xl font-body py-4 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-primary mb-2">
                  Age
                </label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  type="number"
                  min={18}
                  max={30}
                  className="w-full bg-surface-container-low border-b border-outline-variant/30 text-on-surface text-xl font-body py-4 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <p className="block text-[10px] font-label font-bold uppercase tracking-widest text-primary mb-3">
                  Gender
                </p>
                <div className="flex gap-3">
                  {['Male', 'Female'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setGender(option)}
                      className={cn(
                        'flex-1 py-4 border text-sm uppercase font-label tracking-widest transition-colors',
                        gender === option
                          ? 'border-primary text-primary bg-surface-container-high'
                          : 'border-outline-variant/30 text-on-surface-variant bg-surface-container-low hover:border-primary/60'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-primary mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  rows={4}
                  className="w-full resize-none bg-surface-container-low border border-outline-variant/30 text-on-surface font-body p-4 focus:outline-none focus:border-primary transition-colors"
                />
                <p className="mt-2 text-[10px] uppercase font-label font-bold tracking-widest text-on-surface-variant text-right">
                  {bio.length} / 300
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase font-bold font-label tracking-widest text-primary">
                  Question {quizStep + 1} / {quizQuestions.length}
                </span>
                <span className="text-[10px] uppercase font-bold font-label tracking-widest text-on-surface-variant">
                  Mini Progress
                </span>
              </div>
              <div className="h-[2px] w-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold font-headline leading-tight tracking-tight text-on-surface">
              {currentQuiz.question}
            </h2>

            <div className="space-y-3">
              {currentQuiz.options.map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    setQuizAnswers((prev) => ({ ...prev, [currentQuiz.id]: answer }));
                  }}
                  className={cn(
                    'w-full text-left p-5 transition-all duration-300',
                    quizAnswers[currentQuiz.id] === answer
                      ? 'bg-surface-container-high border-l-2 border-primary text-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  )}
                >
                  {answer}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="flex flex-col items-center justify-center text-center gap-6 py-10">
            <motion.h2
              className="text-3xl font-bold font-headline leading-tight tracking-tight text-on-surface"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              Finding your matches...
            </motion.h2>
            <p className="text-on-surface-variant text-lg leading-relaxed font-body opacity-80 max-w-md">
              We&apos;re running the algorithm. You&apos;ll be notified when your match is ready.
            </p>
            {isSaving ? (
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Saving profile...</p>
            ) : null}
            {saveError ? (
              <p className="text-sm text-red-500">{saveError}</p>
            ) : null}
          </section>
        ) : null}
      </main>

      <footer className="fixed bottom-0 w-full p-6 bg-surface/90 backdrop-blur-xl flex flex-col gap-4">
        {step < 4 ? (
          <Button
            onClick={handleNext}
            className="w-full h-14"
            disabled={!canGoNext()}
          >
            {step === 3 && quizStep === quizQuestions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        ) : (
          <Button
            onClick={() => router.push('/profile')}
            className="w-full h-14"
            disabled={!isSaved || isSaving}
          >
            Continue
          </Button>
        )}
        <p className="text-center text-[10px] uppercase font-bold text-gray-600 tracking-tighter">
          Curating your experience...
        </p>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-20 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
