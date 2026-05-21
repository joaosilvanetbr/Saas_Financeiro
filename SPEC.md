# FinanceFlow - Controle Financeiro Pessoal

## 1. Concept & Vision

**FinanceFlow** é um SaaS minimalista de controle financeiro pessoal com tema **dark "lofi sunset"**. A experiência transmite **confiança e controle** — o usuário abre o app e entende onde está financeiramente. Interface escura com cards informativos, navegação por mês com setas, e funcionalidades completas de CRUD.

## 2. Design Language

### Aesthetic Direction
Design **Dark Lofi Sunset** — inspirado em apps modernos com tema escuro. Backgrounds em tons de roxo/midnight, acentos em amarelo e laranja neon, cores vibrantes para comunicar saúde financeira.

### Color Palette
```css
Primary Background: #0f0a1a (Deep Purple Midnight)
Secondary Background: #1a1230 (Lighter Purple)
Surface/Cards: #251d3a (Purple Card)
Primary Accent: #fbbf24 (Yellow/Amber)
Secondary Accent: #f97316 (Orange)
Success: #22c55e (Green - entradas/saldo positivo)
Danger: #ef4444 (Red - saídas/saldo negativo)
Text Primary: #f8fafc (Near White)
Text Secondary: #a1a1aa (Zinc-400)
Border: #3b3052 (Purple Border)
```

### Typography
- **Headings**: Inter (700, 600) — Google Fonts
- **Body**: Inter (400, 500)
- **Numbers/Money**: Inter (600) com `font-variant-numeric: tabular-nums`

### Spatial System
- Base unit: 4px
- Card padding: 24px
- Gap between cards: 16px
- Border radius: 16px (cards), 10px (buttons), 8px (inputs)

### Motion Philosophy
- **Transitions**: 200ms ease-out para hover states
- **Cards**: Scale sutil (1.02) no hover com glow
- **Modais**: Fade-in 200ms + scale de 0.95 para 1
- **Lista de transações**: Stagger animation de 50ms entre items
- **Month arrows**: Scale no hover

### Visual Assets
- **Icons**: Lucide Icons (SVG inline)
- **Empty states**: Ícone + mensagem + CTA
- **Gradients**: Backgrounds com gradientes sutis purple

## 3. Layout & Structure

### Page Structure
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo + Seletor de Mês (com setas)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  ENTRADAS  │  │   SAÍDAS   │  │    SALDO    │       │
│  │   R$5.000  │  │  R$3.000   │  │   R$2.000   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│            ┌─────────────────────────┐                 │
│            │  + Nova Transação        │                 │
│            └─────────────────────────┘                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TRANSAÇÕES DO MÊS                               │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ Salário        +R$ 5.000    Pago    📝🗑️│   │   │
│  │  │ Supermercado   -R$ 450      Pago    📝🗑️│   │   │
│  │  │ Aluguel       -R$ 1.500  Pendente  📝🗑️│   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (>1024px)**: 3 cards de resumo em linha
- **Tablet (768-1024px)**: 3 cards em linha, botões empilhados
- **Mobile (<768px)**: Cards empilhados verticalmente

## 4. Features & Interactions

### Core Features

#### 4.1 Dashboard Cards (Entradas/Saídas/Saldo)
- **Entradas**: Total de valores positivos no mês (verde)
- **Saídas**: Total de valores negativos no mês (vermelho)
- **Saldo**: Soma algébrica (amarelo/dourado)
- **Hover**: Scale 1.02 com glow sutil

#### 4.2 Seletor de Mês
- Navegação com **setas** (← →) nos lados da data
- Formato: "Maio 2026"
- Permite navegar para meses futuros
- Persiste seleção no localStorage

#### 4.3 Modal de Nova Transação
- Abre ao clicar em "+ Nova Transação"
- **Campos**:
  - Descrição (texto, obrigatório, max 100 chars)
  - Valor (número, obrigatório, > 0)
  - Tipo (botões: Entrada/Saída)
  - Data (date picker)
- **Botão**: "Adicionar"
- **Estados**: default, loading, success, error

#### 4.4 Lista de Transações
- Ordenada por data (mais recente primeiro)
- Cada item mostra:
  - Descrição
  - Valor (colorido por tipo)
  - Badge "Pago" (verde) ou "Pendente" (amarelo)
  - Ações na **direita**: Editar (📝) e Deletar (🗑️)
- **Hover**: Background sutil highlight
- **Empty state**: "Nenhuma transação este mês"

### Interaction Details

| Elemento | Hover | Click | Loading | Error |
|----------|-------|-------|---------|-------|
| Card resumo | Scale 1.02, glow | - | - | - |
| Botão adicionar | bg mais claro | Abre modal | Spinner | Shake |
| Month arrow | Scale 1.1 | Muda mês | - | - |
| Item transação | bg highlight | - | - | - |
| Botão editar | bg highlight | Abre modal edit | Spinner | - |
| Botão deletar | bg red | Confirmação | Spinner | - |
| Badge Pago/Pendente | - | Toggle status | Spinner | - |

### Edge Cases
- **Mês sem transações**: Empty state
- **Valor alto**: Formatar com separador de milhar
- **Descrição vazia**: Mensagem de erro inline
- **Conexão lenta**: Loading states

## 5. Component Inventory

### SummaryCard
- **Props**: title, value, type (income/expense/balance), icon
- **States**: default, hover
- **Styling**: bg-gradient, rounded-2xl, p-6, text colored

### MonthSelector
- **Props**: selectedMonth, onChange
- **States**: default
- **Styling**: flex centered, arrows on sides
- **Features**: Navegação livre (passado e futuro)

### TransactionModal
- **Props**: isOpen, onClose, onSubmit, initialData?, isLoading
- **States**: closed, open, submitting
- **Fields**: description, amount, type (income/expense), date
- **Modes**: create (new) e edit (existing)

### TransactionItem
- **Props**: transaction { id, description, amount, type, date, isPaid }
- **States**: default, hover
- **Actions**: togglePaid, edit, delete
- **Layout**: description | value | badge | actions

### TransactionList
- **Props**: transactions[], onEdit, onDelete, onTogglePaid
- **Features**: Lista ordenada, divider lines entre items

### AuthPage
- **Props**: onAuthSuccess
- **States**: login mode, register mode
- **Fields**: email, password, name (register only)
- **Features**: Toggle entre login/registro

### Button
- **Variants**: primary (yellow), secondary (purple), danger (red)
- **States**: default, hover, active, disabled, loading

### Modal
- **Props**: isOpen, onClose, title, children
- **Styling**: backdrop blur, centered, rounded

### Input
- **Props**: label, type, value, onChange, error?, placeholder
- **States**: default, focus, error, disabled

## 6. Technical Approach

### Stack
- **Framework**: Vite + React 18
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **State**: React useState/useEffect
- **Database**: Supabase (Auth + PostgreSQL)

### Data Model

```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // ISO date YYYY-MM-DD
  createdAt: string;
  isPaid: boolean;
  userId?: string;
}

interface AppState {
  transactions: Transaction[];
  selectedMonth: string; // "YYYY-MM"
  user: SupabaseUser | null;
}
```

### File Structure
```
finance-app/src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── AuthPage.tsx
│   ├── SummaryCard.tsx
│   ├── MonthSelector.tsx
│   ├── TransactionModal.tsx
│   ├── TransactionList.tsx
│   └── TransactionItem.tsx
├── hooks/
│   └── useLocalStorage.ts
├── lib/
│   ├── mockData.ts
│   ├── formatters.ts
│   ├── utils.ts
│   └── supabase.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Supabase Schema
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their transactions" 
ON transactions FOR ALL USING (auth.uid() = user_id);
```

### API Endpoints (via Supabase Client)
- `POST /transactions` - Criar transação
- `GET /transactions?user_id=eq.{id}` - Listar do usuário
- `PATCH /transactions?id=eq.{id}` - Editar
- `DELETE /transactions?id=eq.{id}` - Deletar

## 7. Implemented Features Checklist

- [x] Tema dark "lofi sunset"
- [x] Cards de resumo (Entradas/Saídas/Saldo)
- [x] Navegação por mês com setas
- [x] Modal de nova transação
- [x] Lista de transações
- [x] Badge Pago/Pendente
- [x] Ações: editar, deletar, marcar pago
- [x] Tela de autenticação (login/registro)
- [x] Integração Supabase Auth
- [x] Integração Supabase CRUD
- [x] Empty states
- [x] Formatação de valores monetários
- [x] Responsive design