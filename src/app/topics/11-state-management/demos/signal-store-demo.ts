import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { watchState } from '@ngrx/signals';

import { PRODUCTS } from '../catalog';
import { CartSignalStore } from '../stores/cart-signal-store';
import { CartView } from '../ui/cart-view';
import { ProductList } from '../ui/product-list';

/** How many state snapshots the log keeps. */
const LOG_SIZE = 4;

/** The same cart with NgRx SignalStore, plus a log of every state change. */
@Component({
  selector: 'app-signal-store-demo',
  imports: [ProductList, CartView],
  // A new store for this component and its children; destroyed with the component.
  providers: [CartSignalStore],
  template: `
    <div class="shop">
      <app-product-list [products]="products" (add)="cart.add($event)" />
      <app-cart-view
        [lines]="cart.lines()"
        [count]="cart.count()"
        [total]="cart.total()"
        (remove)="cart.remove($event)"
        (clear)="cart.clear()"
      />
    </div>
    <p class="hint log-title">State changes (<code>watchState</code>), newest first:</p>
    <ul class="log state-log">
      @for (entry of log(); track entry.id) {
        <li>#{{ entry.id }} {{ entry.text }}</li>
      }
    </ul>
  `,
  styleUrl: './state-demo.scss',
  styles: `
    .log-title {
      margin-top: 0.75rem;
    }

    .log {
      margin-top: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalStoreDemo {
  protected readonly cart = inject(CartSignalStore);
  protected readonly products = PRODUCTS.slice(4);
  protected readonly log = signal<readonly { id: number; text: string }[]>([]);
  private nextId = 0;

  constructor() {
    // watchState runs synchronously on every patchState (an effect would batch them), with the
    // whole state object. Handy for logging or persisting; stops when the component is destroyed.
    watchState(this.cart, (state) => {
      const lines = state.lines.map((line) => `${line.product.name}×${line.quantity}`);
      const text = `{ lines: [${lines.join(', ')}] }`;
      this.log.update((log) => [{ id: this.nextId++, text }, ...log].slice(0, LOG_SIZE));
    });
  }
}
