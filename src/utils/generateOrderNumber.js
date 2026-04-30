export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `ALT-${year}${suffix}`;
}