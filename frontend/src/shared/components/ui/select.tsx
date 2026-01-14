import { type SelectHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, options, placeholder, ...props }, ref) => {
    const hasIcon = !!icon;

    return (
      <div className="w-full group">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 floating-label group-focus-within:text-brand-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={twMerge(
              clsx(
                'w-full py-2.5 border rounded-xl shadow-[var(--shadow-soft)] sm:text-sm bg-white appearance-none cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary',
                'hover:border-brand-primary/40',
                hasIcon ? 'pl-10 pr-10' : 'pl-3.5 pr-10',
                error 
                  ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' 
                  : 'border-[var(--color-border-subtle)]',
                className
              )
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
            <ChevronDown size={18} />
          </div>
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

Select.displayName = 'Select';

export default Select;
