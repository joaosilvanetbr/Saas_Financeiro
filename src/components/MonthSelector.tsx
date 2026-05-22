import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

export function MonthSelector({ selectedMonth, onChange }: MonthSelectorProps) {
  const currentLabel = getMonthLabel(selectedMonth);

  const goToPrevious = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(year, month - 2, 1);
    onChange(formatMonth(newDate));
  };

  const goToNext = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(year, month, 1);
    onChange(formatMonth(newDate));
  };

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-2 py-1 backdrop-blur-sm">
      <button
        onClick={goToPrevious}
        className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        title="Mês anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="px-3 py-1 text-slate-200 font-medium min-w-[140px] text-center">
        {currentLabel}
      </span>
      
      <button
        onClick={goToNext}
        className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        title="Próximo mês"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function getMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function formatMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}