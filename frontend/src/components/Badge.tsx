import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center font-display font-bold rounded-full border transition-all duration-300';
  
  const variants = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    danger: 'bg-accent/10 border-accent/20 text-accent',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1'
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
