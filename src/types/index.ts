export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
  isPaid: boolean;
  userId?: string;
}

export interface AppState {
  transactions: Transaction[];
  selectedMonth: string;
}