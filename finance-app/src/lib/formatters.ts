export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCurrencyInput(value: string): string {
  // Remove tudo que não é número
  const numericValue = value.replace(/\D/g, '');
  
  // Converte para número com centavos
  const number = parseInt(numericValue) / 100;
  
  if (isNaN(number)) return '';
  
  // Formata com separador de milhar
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyInput(value: string): number {
  // Remove tudo que não é número e converte para cents
  const numericValue = value.replace(/\D/g, '');
  return parseInt(numericValue) / 100;
}