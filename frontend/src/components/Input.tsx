import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-semibold text-text-dark-muted tracking-wider uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-text-dark-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-card-dark/50 border border-border-dark rounded-xl px-4 py-3 text-sm text-text-dark
              placeholder:text-text-dark-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30
              transition-all duration-300
              ${leftIcon ? 'pl-11' : ''}
              ${error ? 'border-accent/50 focus:border-accent focus:ring-accent/30' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-accent font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
