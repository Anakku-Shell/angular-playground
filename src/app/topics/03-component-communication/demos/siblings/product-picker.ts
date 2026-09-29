import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStore, Product } from './cart-store';

/** Sibling 1: writes to the store. It knows nothing about CartSummary. */
@Component({
  selector: 'app-product-picker',
  imports: [CurrencyPipe],
  template: `
    <h4>Products</h4>
    <ul>
      @for (product of products; track product.id) {
        <li>
          <span>{{ product.name }} · {{ product.price | currency: 'EUR' }}</span>
          <button type="button" (click)="store.add(product)">Add</button>
        </li>
      }
    </ul>
  `,
  styleUrl: './sibling-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPicker {
  protected readonly store = inject(CartStore);

  protected readonly products: readonly Product[] = [
    { id: 1, name: 'Keyboard', price: 49 },
    { id: 2, name: 'Mouse', price: 19.5 },
    { id: 3, name: 'Monitor', price: 189 },
  ];
}
