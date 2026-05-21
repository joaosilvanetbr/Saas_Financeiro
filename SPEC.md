# FinanceFlow - Controle Financeiro Pessoal

## 1. Concept & Vision

**FinanceFlow** é um SaaS minimalista de controle financeiro pessoal, focado em simplicidade e clareza. A experiência deve transmitir **confiança e controle** — o usuário abre o app e, em segundos, entende exatamente onde está financeiramente. Interface limpa com cards informativos, navegação intuitiva e zero complexidade desnecessária.

## 2. Design Language

### Aesthetic Direction
Design **Clean Finance** — inspirado em apps bancários modernos como Nubank e N26. Cards com sombras sutis, tipografia clara, e uso estratégico de cor para comunicar saúde financeira (verde = positivo, vermelho = negativo).

### Color Palette
```
Primary:        #6366F1 (Indigo-500)    — Ações principais,botões
Secondary:      #8B5CF6 (Violet-500)    — Destaques, badges
Success:        #10B981 (Emerald-500)   — Entradas, saldo positivo
Danger:         #EF4444 (Red-500)       — Saídas, saldo negativo
Background:     #F8FAFC (Slate-50)     — Fundo principal
Surface:        #FFFFFF (White)        — Cards, componentes
Border:         #E2E8F0 (Slate-200)     — Bordas sutis
Text Primary:   #1E293B (Slate-800)    — Títulos
Text Secondary: #64748B (Slate-500)    — Descrições
```

### Typography
- **Headings**: Inter (700, 600) — Google Fonts
- **Body**: Inter (400, 500) — Google Fonts
- **Numbers/Money**: Inter (600) com feature `font-variant-numeric: tabular-nums`

### Spatial System
- Base unit: 4px
- Card padding: 24px
- Gap between cards: 16px
- Border radius: 12px (cards), 8px (buttons), 6px (inputs)

### Motion Philosophy
- **Transitions**: 200ms ease-out para hover states
- **Cards**: Scale sutil (1.01) no hover
- **Modais**: Fade-in 200ms + translateY de -8px
- **Lista de transações**: Stagger animation de 50ms entre items

### Visual Assets
- **Icons**: Lucide Icons (SVG inline) — simplicidade e consistência
- **Ilustrações**: Nenhuma — foco em dados
- **Empty states**: Ícone + mensagem + CTA

## 3. Layout & Structure

### Page Structure
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo + Seletor de Mês                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   SALDO     │  │  ENTRADAS   │  │   SAÍDAS    │   │
│  │   R$5.000   │  │  R$8.000    │  │  R$3.000    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NOVA TRANSAÇÃO                                 │   │
│  │  [Descrição] [Valor] [+Entrada] [-Saída]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TRANSAÇÕES DO MÊS                              │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ 📦 Salário          +R$ 5.000    Hoje   │   │   │
│  │  │ 🛒 Supermercado     -R$ 450     18/05   │   │   │
│  │  │ ⚡ Conta de luz     -R$ 120     15/05   │   │   │
│  │  │ 🎮 Assinatura PSN    -R$ 85      10/05   │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (>1024px)**: 3 cards de resumo em linha, formulário inline
- **Tablet (768-1024px)**: 3 cards em linha, formulário empilhado
- **Mobile (<768px)**: Cards empilhados, navegação simplificada

## 4. Features & Interactions

### Core Features

#### 4.1 Dashboard Cards (Saldo/Entradas/Saídas)
- **Saldo**: Soma algébrica de todas entradas menos saídas do mês
- **Entradas**: Total de valores positivos no mês
- **Saídas**: Total de valores negativos no mês
- **Hover**: Sutil elevação do card
- **Click**: Não aplicável (display only)

#### 4.2 Seletor de Mês
- Dropdown com meses do ano atual e anterior
- Formato: "Maio 2026"
- Muda contexto de todas as métricas instantaneamente
- Persiste seleção no localStorage

#### 4.3 Formulário de Nova Transação
- **Campos**:
  - Descrição (texto, obrigatório, max 100 chars)
  - Valor (número, obrigatório, > 0)
  - Tipo (toggle ou botões: Entrada/Saída)
- **Botão**: "Adicionar Transação"
- **Estados**:
  - Default: Campos vazios, tipo "Entrada" selecionado
  - Loading: Botão desabilitado com spinner
  - Success: Feedback visual, campos limpos
  - Error: Mensagem inline no campo relevante

#### 4.4 Lista de Transações
- Ordenada por data (mais recente primeiro)
- Cada item mostra: ícone categoria, descrição, valor (colorido), data
- **Hover**: Background sutil
- **Delete**: Ícone de lixeira aparece no hover, confirmação antes de deletar
- **Empty state**: Ilustração + "Nenhuma transação este mês"

### Interaction Details

| Elemento | Hover | Click | Loading | Error |
|----------|-------|-------|---------|-------|
| Card resumo | Scale 1.01, shadow aumenta | - | - | - |
| Botão adicionar | bg mais escuro | Adiciona transação | Spinner | Shake + mensagem |
| Item transação | bg slate-100 | - | - | - |
| Botão delete | bg red-50 | Confirmação | Spinner | - |

### Edge Cases
- **Mês sem transações**: Mostrar empty state
- **Valor muito alto**: Formatar com abreviação (1.000,00)
- **Descrição vazia**: Bloquear envio com mensagem
- **Conexão lenta**: Mostrar loading state

## 5. Component Inventory

### SummaryCard
- **Props**: title, value, type (positive/negative/neutral), icon
- **States**: default, hover
- **Styling**: bg-white, rounded-xl, shadow-sm, p-6

### MonthSelector
- **Props**: selectedMonth, onChange
- **States**: default, open (dropdown)
- **Styling**: bg-white, rounded-lg, border, cursor-pointer

### TransactionForm
- **Props**: onSubmit, isLoading
- **States**: default, submitting, success, error
- **Fields**: description (input), amount (input number), type (toggle)

### TransactionItem
- **Props**: transaction { id, description, amount, type, date }
- **States**: default, hover, deleting
- **Actions**: delete (with confirmation)

### Button
- **Variants**: primary, secondary, danger
- **States**: default, hover, active, disabled, loading

### Modal (para confirmação de delete)
- Backdrop blur
- Centralizado
- Título + descrição + ações

## 6. Technical Approach

### Stack
- **Framework**: Vite + React 18
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **State**: React useState/useEffect (simples, sem Redux)
- **Data**: Mock data + localStorage para persistência
- **Supabase**: Configurado mas apenas para futuras integrações (frontend first)

### Data Model

```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number; // positivo = entrada, negativo = saída
  type: 'income' | 'expense';
  date: string; // ISO date
  createdAt: string;
}

interface AppState {
  transactions: Transaction[];
  selectedMonth: string; // "YYYY-MM"
}
```

### File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── SummaryCard.tsx
│   ├── MonthSelector.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   └── TransactionItem.tsx
├── hooks/
│   └── useLocalStorage.ts
├── lib/
│   ├── mockData.ts
│   ├── formatters.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Supabase Integration (Future)
- Auth: Supabase Auth (futuro)
- Database: transactions table
- Realtime: subscriptions para sync (futuro)

### Performance
- Lazy loading de componentes pesados
- Memoização de cálculos de totais
- Virtualização se > 100 transações
