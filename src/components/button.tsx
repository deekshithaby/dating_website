'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container transition-all hover:scale-[1.02] active:scale-95 shadow-2xl font-headline font-bold uppercase tracking-widest',
      secondary: 'bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-all border border-outline/10 font-headline font-bold uppercase tracking-widest',
      outline: 'bg-transparent border border-outline/30 text-on-surface hover:bg-surface-container-low transition-all font-headline font-bold uppercase tracking-widest',
      ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low transition-all font-headline font-bold uppercase tracking-widest',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-12 py-5 text-xl',
      xl: 'px-16 py-8 text-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
