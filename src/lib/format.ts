const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function stockClass(stock: number): string {
  if (stock === 0) return "bg-red-100 text-red-700";
  if (stock < 10) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}
