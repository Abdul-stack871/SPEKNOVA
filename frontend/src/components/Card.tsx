import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  glowEffect = false,
  glass = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${glass ? 'glass-panel' : 'bg-card-dark border border-border-dark'}
        ${hoverEffect ? 'hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] hover:-translate-y-1' : ''}
        ${glowEffect ? 'shadow-[0_0_25px_rgba(139,92,246,0.15)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
