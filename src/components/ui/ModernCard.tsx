import React from 'react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glassmorphic' | 'gradient' | 'elevated' | 'impact';
  children: React.ReactNode;
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl transition-all duration-300';

    const variants = {
      default: 'bg-white dark:bg-slate-900 shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700',
      glassmorphic: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-white/20 dark:border-slate-700/20 hover:shadow-xl',
      gradient: 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl',
      elevated: 'bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl',
      impact: 'bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 shadow-lg border border-blue-200 dark:border-blue-800/30 hover:shadow-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModernCard.displayName = 'ModernCard';
