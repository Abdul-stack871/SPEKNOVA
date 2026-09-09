import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-display font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-secondary hover:bg-secondary/90 text-bg-dark shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border border-border-dark hover:border-primary/50 text-text-dark hover:bg-card-dark/50',
    ghost: 'text-text-dark-muted hover:text-text-dark hover:bg-card-dark/30',
    glow: 'bg-transparent border-gradient text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
