import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconPosition = 'left', ...props }, ref) => {
    const hasIcon = !!icon;

    return (
      <div className="w-full group">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 floating-label group-focus-within:text-brand-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full py-2.5 border rounded-xl shadow-[var(--shadow-soft)] sm:text-sm bg-white placeholder:text-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary',
                'hover:border-brand-primary/40',
                hasIcon && iconPosition === 'left' ? 'pl-10 pr-3.5' : hasIcon && iconPosition === 'right' ? 'pl-3.5 pr-10' : 'px-3.5',
                error 
                  ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' 
                  : 'border-[var(--color-border-subtle)]',
                className
              )
            )}
            {...props}
          />
          {hasIcon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
