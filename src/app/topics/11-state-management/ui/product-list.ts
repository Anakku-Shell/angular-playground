import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Product } from '../catalog';

/**
 * Presentational ("dumb") component: data comes in through inputs, user intent goes out
 * through outputs. It knows nothing about stores, so both cart demos reuse it.
 */
@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  template: `
    <ul class="products">
      @for (product of products(); track product.id) {
        <li>
          <span class="name">{{ product.name }}</span>
          <span class="price">{{ product.price | currency: 'EUR' }}</span>
          <button
            type="button"
            (click)="add.emit(product)"
            [attr.aria-label]="'Add ' + product.name"
          >
            Add
          </button>
        </li>
      }
    </ul>
  `,
  styles: `
    .products {
      display: grid;
      gap: 0.35rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .name {
      flex: 1;
      min-width: 0;
    }

    .price {
      color: var(--color-text-muted);
      font-variant-numeric: tabular-nums;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  readonly products = input.required<readonly Product[]>();
  readonly add = output<Product>();
}
