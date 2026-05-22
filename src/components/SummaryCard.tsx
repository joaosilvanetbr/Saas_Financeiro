import type { ReactNode } from 'react';
import { formatCurrency } from '../lib/formatters';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  type: 'positive' | 'negative' | 'neutral';
}

export function SummaryCard({ title, value, icon, type }: SummaryCardProps) {
  const colorClasses = {
    positive: 'text-violet-400',
    negative: 'text-orange-400',
    neutral: 'text-yellow-400',
  };

  const bgClasses = {
    positive: 'bg-violet-500/10 border border-violet-500/20',
    negative: 'bg-orange-500/10 border border-orange-500/20',
    neutral: 'bg-yellow-500/10 border border-yellow-500/20',
  };

  return (
    <div className={`flex-1 min-w-[200px] rounded-2xl p-6 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${bgClasses[type]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className={`text-2xl font-semibold ${colorClasses[type]}`}>
            {formatCurrency(value)}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${bgClasses[type]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}