import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PRODUCTS } from '../products';

/** Route `products`. Query params arrive as inputs thanks to `withComponentInputBinding()`. */
@Component({
  selector: 'app-product-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <h3>Products</h3>

    @if (missing(); as id) {
      <p class="notice missing-notice" role="status">
        Product #{{ id }} does not exist: the resolver redirected here.
      </p>
    }

    <div class="demo-row">
      Sort by:
      <!-- [routerLink]="[]" = the current route; only the query params change. -->
      <a [routerLink]="[]" [queryParams]="{ sort: 'name' }" routerLinkActive="is-active">name</a>
      <a [routerLink]="[]" [queryParams]="{ sort: 'price' }" routerLinkActive="is-active">price</a>
    </div>

    <ul class="product-list">
      @for (product of sorted(); track product.id) {
        <li>
          <!-- Relative link: this route is /products, so it points to /products/<id>. -->
          <a [routerLink]="[product.id]">{{ product.name }}</a> ({{ product.price }} €)
        </li>
      }
    </ul>

    <p class="hint">Query param <code>sort</code> → input: {{ sort() ?? 'undefined' }}</p>
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  /** `?sort=...`. Reset to undefined when the query param disappears. */
  readonly sort = input<string>();
  /** `?missing=...`, set by the product resolver when it redirects here. */
  readonly missing = input<string>();

  protected readonly sorted = computed(() => {
    const byPrice = this.sort() === 'price';
    return [...PRODUCTS].sort((a, b) =>
      byPrice ? a.price - b.price : a.name.localeCompare(b.name),
    );
  });
}
