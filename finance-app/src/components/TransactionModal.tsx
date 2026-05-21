import { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Plus, Pencil } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { Transaction } from '../types';
import { parseCurrencyInput } from '../lib/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction?: Transaction | null;
  isLoading?: boolean;
}

export function TransactionModal({ isOpen, onClose, onSubmit, editTransaction, isLoading }: TransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});

  const isEditing = !!editTransaction;

  useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }));
      setType(editTransaction.type);
      setDate(editTransaction.date);
    } else {
      setDescription('');
      setAmount('');
      setType('income');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { description?: string; amount?: string } = {};
    
    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (description.length > 100) {
      newErrors.description = 'Máximo 100 caracteres';
    }
    
    const parsedAmount = parseCurrencyInput(amount);
    if (!amount) {
      newErrors.amount = 'Valor é obrigatório';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      description: description.trim(),
      amount: parsedAmount,
      type,
      date: date || new Date().toISOString().split('T')[0],
      isPaid: editTransaction?.isPaid ?? true,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 border border-slate-700/50 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          {isEditing ? (
            <>
              <Pencil className="w-5 h-5 text-yellow-400" />
              Editar Transação
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-yellow-400" />
              Nova Transação
            </>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Descrição"
            placeholder="Ex: Salário, Supermercado..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
            }}
            error={errors.description}
            maxLength={100}
          />
          
          <Input
            label="Valor"
            type="text"
            placeholder="R$ 0,00"
            value={amount}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              if (numericValue === '') {
                setAmount('');
              } else {
                const number = parseInt(numericValue) / 100;
                setAmount(number.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }));
              }
              if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
            }}
            error={errors.amount}
          />
          
          <Input
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="[color-scheme:dark]"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                type === 'income'
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/20'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:text-violet-400 hover:border-violet-500/30'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Entrada
            </button>
            
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                type === 'expense'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/20'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:text-orange-400 hover:border-orange-500/30'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Saída
            </button>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}