import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CartLine } from '../catalog';

/** Presentational cart: lines and totals in, remove / clear requests out. */
@Component({
  selector: 'app-cart-view',
  imports: [CurrencyPipe],
  template: `
    <h3 class="title">Cart</h3>
    @if (lines().length) {
      <ul class="lines">
        @for (line of lines(); track line.product.id) {
          <li>
            <span class="line-name">{{ line.quantity }} × {{ line.product.name }}</span>
            <button
              type="button"
              (click)="remove.emit(line.product.id)"
              [attr.aria-label]="'Remove one ' + line.product.name"
            >
              −
            </button>
          </li>
        }
      </ul>
      <p class="summary">
        <span class="cart-count">{{ count() }} {{ count() === 1 ? 'item' : 'items' }}</span> ·
        <strong class="cart-total">{{ total() | currency: 'EUR' }}</strong>
      </p>
      <button type="button" class="clear" (click)="clear.emit()">Empty cart</button>
    } @else {
      <p class="empty">The cart is empty.</p>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
    }

    .title {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }

    .lines {
      display: grid;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .summary {
      margin: 0.75rem 0 0.5rem;
    }

    .empty {
      margin: 0;
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartView {
  readonly lines = input.required<readonly CartLine[]>();
  readonly count = input.required<number>();
  readonly total = input.required<number>();

  readonly remove = output<number>();
  readonly clear = output<void>();
}
