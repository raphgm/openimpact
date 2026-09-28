import React from 'react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ label, error, icon, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg',
              'bg-white dark:bg-slate-800',
              'border-2 border-slate-200 dark:border-slate-700',
              'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
              'dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
              'placeholder-slate-400 dark:placeholder-slate-500',
              'text-slate-900 dark:text-white',
              'transition-all duration-300',
              error && 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/20',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ModernInput.displayName = 'ModernInput';
