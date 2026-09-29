import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError, timer } from 'rxjs';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

/** One product in the cart and how many of it. */
export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
}

export const PRODUCTS: readonly Product[] = [
  { id: 1, name: 'Keyboard', price: 49 },
  { id: 2, name: 'Mouse', price: 19 },
  { id: 3, name: 'Monitor', price: 189 },
  { id: 4, name: 'Headphones', price: 79 },
  { id: 5, name: 'Webcam', price: 59 },
  { id: 6, name: 'Microphone', price: 99 },
  { id: 7, name: 'Monitor arm', price: 39 },
  { id: 8, name: 'Mouse pad', price: 9 },
];

/** Fake network latency of the catalog search. */
export const CATALOG_LATENCY_MS = 400;

/**
 * In-memory stand-in for a products API: answers after a delay, like a real request would.
 * No HTTP here so the topic works offline; topic 09 covers HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class CatalogApi {
  search(term: string, fail = false): Observable<Product[]> {
    if (fail) {
      // delay() does not delay errors, so wait first and then fail.
      return timer(CATALOG_LATENCY_MS).pipe(
        switchMap(() => throwError(() => new Error(`Search for "${term}" failed`))),
      );
    }
    const needle = term.toLowerCase();
    const matches = PRODUCTS.filter((p) => p.name.toLowerCase().includes(needle));
    return of(matches).pipe(delay(CATALOG_LATENCY_MS));
  }
}

/** Adds one unit of a product to the lines, returning a new array (immutable update). */
export function addLine(lines: readonly CartLine[], product: Product): CartLine[] {
  const existing = lines.find((line) => line.product.id === product.id);
  return existing
    ? lines.map((line) => (line === existing ? { ...line, quantity: line.quantity + 1 } : line))
    : [...lines, { product, quantity: 1 }];
}

/** Removes one unit of a product; the line disappears when it reaches zero. */
export function removeLine(lines: readonly CartLine[], productId: number): CartLine[] {
  return lines
    .map((line) =>
      line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,
    )
    .filter((line) => line.quantity > 0);
}

export function countItems(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function totalPrice(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0);
}
