import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStore } from './cart-store';

/** Sibling 2: reads from the store. It knows nothing about ProductPicker. */
@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe],
  template: `
    <h4>Cart ({{ store.count() }})</h4>
    <ul>
      @for (line of store.lines(); track line.product.id) {
        <li>
          <span>{{ line.quantity }} × {{ line.product.name }}</span>
        </li>
      } @empty {
        <li class="empty">Empty</li>
      }
    </ul>
    <p class="total">
      Total: <strong>{{ store.total() | currency: 'EUR' }}</strong>
      <button type="button" [disabled]="store.count() === 0" (click)="store.clear()">Clear</button>
    </p>
  `,
  styleUrl: './sibling-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  protected readonly store = inject(CartStore);
}
