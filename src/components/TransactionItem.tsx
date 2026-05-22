import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency } from '../lib/formatters';
import { formatDate } from '../lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onTogglePaid: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onTogglePaid, onEdit, onDelete }: TransactionItemProps) {
  const [showActions, setShowActions] = useState(false);
  const isIncome = transaction.type === 'income';
  
  return (
    <>
      <div 
        className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
          !transaction.isPaid 
            ? 'bg-amber-500/10 border border-amber-500/20' 
            : 'hover:bg-slate-700/30'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-lg ${
            isIncome 
              ? 'bg-violet-500/20 text-violet-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isIncome ? (
              <ArrowUpCircle className="w-5 h-5" />
            ) : (
              <ArrowDownCircle className="w-5 h-5" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${
                !transaction.isPaid ? 'text-amber-400' : 'text-slate-100'
              }`}>
                {transaction.description}
              </p>
              {transaction.isPaid ? (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                  Pago
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                  Pendente
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`font-semibold ${isIncome ? 'text-violet-400' : 'text-orange-400'}`}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
          
          <div className={`flex items-center gap-1 transition-all ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => onTogglePaid(transaction.id)}
              className={`p-2 rounded-lg transition-all ${
                transaction.isPaid 
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20'
              }`}
              title={transaction.isPaid ? 'Marcar como não pago' : 'Marcar como pago'}
            >
              {transaction.isPaid ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/20 transition-all"
              title="Editar transação"
            >
              <Pencil className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-orange-400 hover:bg-orange-500/20 transition-all"
              title="Excluir transação"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-px bg-slate-700/30 mx-2" />
    </>
  );
}