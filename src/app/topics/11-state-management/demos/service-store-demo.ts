import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PRODUCTS } from '../catalog';
import { CartStore } from '../stores/cart-store';
import { CartView } from '../ui/cart-view';
import { ProductList } from '../ui/product-list';

/**
 * A component far from the cart that needs its data: it injects the store instead of
 * receiving inputs through every component in between.
 */
@Component({
  selector: 'app-cart-badge',
  template: `🛒 <span class="badge-count">{{ cart.count() }}</span>`,
  styles: `
    :host {
      display: inline-flex;
      gap: 0.35rem;
      padding: 0.15rem 0.6rem;
      border: 1px solid var(--color-border);
      border-radius: 999px;
      background: var(--color-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartBadge {
  protected readonly cart = inject(CartStore);
}

/** A cart backed by a plain service with signals. */
@Component({
  selector: 'app-service-store-demo',
  imports: [ProductList, CartView, CartBadge],
  template: `
    <div class="demo-row">
      <span class="hint">A badge elsewhere on the page:</span>
      <app-cart-badge />
    </div>
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
    <p class="hint">
      The store is provided in root: add something, visit another topic and come back. The cart is
      still there.
    </p>
  `,
  styleUrl: './state-demo.scss',
  styles: `
    .shop + .hint {
      margin-top: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceStoreDemo {
  protected readonly cart = inject(CartStore);
  protected readonly products = PRODUCTS.slice(0, 4);
}
