export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `৳${num.toLocaleString('en-BD')}`;
}

export function formatCurrencyFull(amount) {
  const num = Number(amount) || 0;
  return `৳${num.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}