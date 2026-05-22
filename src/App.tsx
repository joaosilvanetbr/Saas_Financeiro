import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Trash2, Plus, LogOut, User } from 'lucide-react';
import { SummaryCard } from './components/SummaryCard';
import { MonthSelector } from './components/MonthSelector';
import { TransactionModal } from './components/TransactionModal';
import { TransactionList } from './components/TransactionList';
import { AuthPage } from './components/AuthPage';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { supabase } from './lib/supabase';
import type { Transaction } from './types';
import { getCurrentMonth } from './lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transactionId: string | null }>({
    isOpen: false,
    transactionId: null,
  });

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTransactions(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTransactions(session.user.id);
      } else {
        setTransactions([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTransactions = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!error && data) {
      setTransactions(data.map((t: any) => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.date,
        createdAt: t.created_at,
        isPaid: t.is_paid,
        userId: t.user_id,
      })));
    }
    setIsLoading(false);
  };

  const filteredTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));

  const { totalIncome, totalExpense } = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpense += t.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const finalBalance = totalIncome - totalExpense;

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;
    setIsLoading(true);

    if (editingTransaction) {
      const { error } = await supabase
        .from('transactions')
        .update({
          description: data.description,
          amount: data.amount,
          type: data.type,
          date: data.date,
          is_paid: data.isPaid,
        })
        .eq('id', editingTransaction.id);

      if (!error) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === editingTransaction.id ? { ...t, ...data } : t
          )
        );
      }
      setEditingTransaction(null);
    } else {
      const newTransaction = {
        user_id: user.id,
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: data.date,
        is_paid: data.isPaid ?? true,
      };

      const { data: result, error } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select()
        .single();

      if (!error && result) {
        setTransactions((prev) => [
          {
            id: result.id,
            description: result.description,
            amount: result.amount,
            type: result.type,
            date: result.date,
            createdAt: result.created_at,
            isPaid: result.is_paid,
            userId: result.user_id,
          },
          ...prev,
        ]);
      }
    }
    setIsLoading(false);
    setIsAddModalOpen(false);
  };

  const handleTogglePaid = async (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    const { error } = await supabase
      .from('transactions')
      .update({ is_paid: !transaction.isPaid })
      .eq('id', id);

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isPaid: !t.isPaid } : t))
      );
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!deleteModal.transactionId) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', deleteModal.transactionId);

    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== deleteModal.transactionId));
    }
    setDeleteModal({ isOpen: false, transactionId: null });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-orange-500 rounded-xl shadow-lg shadow-violet-500/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">FinanceFlow</h1>
          </div>
          <div className="flex items-center gap-3">
            <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-violet-500 to-orange-500 text-white rounded-xl hover:from-violet-600 hover:to-orange-600 transition-all shadow-lg shadow-violet-500/30"
              title="Nova transação"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700/50">
              <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
<button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Entradas"
            value={totalIncome}
            icon={<TrendingUp className="w-6 h-6 text-violet-400" />}
            type="positive"
          />
          <SummaryCard
            title="Saídas"
            value={totalExpense}
            icon={<TrendingDown className="w-6 h-6 text-orange-400" />}
            type="negative"
          />
          <SummaryCard
            title="Saldo"
            value={finalBalance}
            icon={<Wallet className="w-6 h-6 text-yellow-400" />}
            type={finalBalance >= 0 ? 'neutral' : 'negative'}
          />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onTogglePaid={handleTogglePaid}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteModal({ isOpen: true, transactionId: id })}
        />
      </main>

      {/* Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSubmit={handleAddTransaction}
        editTransaction={editingTransaction}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transactionId: null })}
        title="Excluir Transação"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, transactionId: null })}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTransaction}
              isLoading={isLoading}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;