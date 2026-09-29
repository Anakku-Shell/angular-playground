import { computed, Injectable, signal } from '@angular/core';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
}

/**
 * State shared by sibling components. Components inject it instead of passing data through
 * their common parent. Not `providedIn: 'root'`: SiblingsDemo lists it in its `providers`, so
 * each demo instance gets its own cart (the Dependency injection topic covers this).
 */
@Injectable()
export class CartStore {
  // Writable state stays private; the outside world gets read-only signals and methods.
  private readonly cartLines = signal<readonly CartLine[]>([]);

  readonly lines = this.cartLines.asReadonly();
  readonly count = computed(() => this.cartLines().reduce((sum, line) => sum + line.quantity, 0));
  readonly total = computed(() =>
    this.cartLines().reduce((sum, line) => sum + line.quantity * line.product.price, 0),
  );

  add(product: Product): void {
    this.cartLines.update((lines) =>
      lines.some((line) => line.product.id === product.id)
        ? lines.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...lines, { product, quantity: 1 }],
    );
  }

  clear(): void {
    this.cartLines.set([]);
  }
}
