import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center rounded-xl font-semibold gap-2',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-55 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: clsx(
      'bg-gradient-to-r from-brand-primary to-brand-primary-strong text-white',
      'shadow-[var(--shadow-soft)]',
      'hover:shadow-lg',
      'focus-visible:ring-brand-primary'
    ),
    secondary: clsx(
      'bg-white text-brand-primary border border-brand-primary/20',
      'shadow-[var(--shadow-soft)]',
      'hover:border-brand-primary/50 hover:shadow-lg hover:bg-brand-primary/5',
      'focus-visible:ring-brand-primary/60'
    ),
    danger: clsx(
      'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'shadow-[var(--shadow-soft)]',
      'hover:shadow-lg',
      'focus-visible:ring-red-500'
    ),
    ghost: clsx(
      'bg-white/50 text-slate-700 border border-transparent',
      'hover:border-slate-200 hover:bg-white hover:shadow-sm',
      'focus-visible:ring-brand-primary/40'
    ),
    outline: clsx(
      'bg-transparent border border-slate-300 text-slate-800',
      'hover:bg-white/60 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-sm',
      'focus-visible:ring-brand-primary'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
