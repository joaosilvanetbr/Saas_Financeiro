import { Receipt } from 'lucide-react';
import type { Transaction } from '../types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onTogglePaid: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onTogglePaid, onEdit, onDelete }: TransactionListProps) {
  // Sort by date (most recent first), unpaid first
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a.isPaid !== b.isPaid) {
      return a.isPaid ? 1 : -1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Transações do Mês</h3>
      
      {sortedTransactions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mb-4">
            <Receipt className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 mb-2">Nenhuma transação este mês</p>
          <p className="text-sm text-slate-500">Clique no + para adicionar</p>
        </div>
      ) : (
        <div className="space-y-0">
          {sortedTransactions.map((transaction) => (
            <div key={transaction.id}>
              <TransactionItem 
                transaction={transaction} 
                onTogglePaid={onTogglePaid}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}