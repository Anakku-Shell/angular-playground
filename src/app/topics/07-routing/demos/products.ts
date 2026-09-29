export interface Product {
  id: number;
  name: string;
  price: number;
}

/** In-memory data for the routing demo. */
export const PRODUCTS: readonly Product[] = [
  { id: 1, name: 'Keyboard', price: 49 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Monitor', price: 189 },
  { id: 4, name: 'Headphones', price: 79 },
];

export function findProduct(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
