export function getDiscountedPrice(price: number, discount: number = 0): number {
  return Math.round(price - (price * discount) / 100);
}
