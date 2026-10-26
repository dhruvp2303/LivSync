import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100
        ${hoverable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
        ${paddings[padding]}
        ${className}`}
    >
      {children}
    </div>
  );
}
