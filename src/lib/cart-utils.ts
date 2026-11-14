
export function calculateCartCount(
  items: { quantity: number }[]
): number {
  return items.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function calculateSubtotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1;
}
