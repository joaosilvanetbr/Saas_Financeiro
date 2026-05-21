import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-slate-200 p-6
        ${hover ? 'transition-all duration-200 hover:shadow-md hover:scale-[1.01]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}