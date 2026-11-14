export function isValidOrderItem(item: {
  productId: number;
  quantity: number;
}): boolean {
  return (
    Number.isSafeInteger(item.productId) &&
    item.productId > 0 &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99
  );
}

export function combineOrderItems(
  items: { productId: number; quantity: number }[]
): Map<number, number> | null {
  const quantities = new Map<number, number>();

  for (const item of items) {
    const combinedQuantity =
      (quantities.get(item.productId) ?? 0) + item.quantity;

    if (combinedQuantity > 99) {
      return null;
    }

    quantities.set(item.productId, combinedQuantity);
  }

  return quantities;
}