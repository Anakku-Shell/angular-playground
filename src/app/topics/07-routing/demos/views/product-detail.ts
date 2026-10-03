import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product, PRODUCTS } from '../products';

/**
 * Route `products/:id`. The router sets `id` from the route param and `product` from the resolver.
 * Going to another id reuses this instance: the inputs change, the component is not recreated.
 */
@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  template: `
    <h3 class="product-name">{{ product().name }}</h3>
    <p>Price: {{ product().price }} €</p>

    <div class="demo-row">
      <button type="button" (click)="go(previousId())">← Previous</button>
      <button type="button" (click)="go(nextId())">Next →</button>
      <a routerLink="..">Back to the list</a>
    </div>

    <p class="hint">
      Route param <code>:id</code> → input: {{ id() }} ({{ typeOfId() }}). Resolved
      <code>product</code> → input.
    </p>
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  // Without withComponentInputBinding(), or in older code, the same values come from
  // ActivatedRoute: route.paramMap / route.data (Observables) or route.snapshot (read once).
  /** [1] Route params are strings; the numberAttribute transform turns "2" into 2. */
  readonly id = input.required({ transform: numberAttribute });
  /** [2] Filled by productResolver (the `product` key of the route's `resolve`). */
  readonly product = input.required<Product>();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly typeOfId = computed(() => typeof this.id());
  private readonly index = computed(() => PRODUCTS.findIndex((p) => p.id === this.product().id));
  protected readonly previousId = computed(
    () => PRODUCTS[(this.index() - 1 + PRODUCTS.length) % PRODUCTS.length].id,
  );
  protected readonly nextId = computed(() => PRODUCTS[(this.index() + 1) % PRODUCTS.length].id);

  // [3] Navigation from code, relative to this route.
  protected go(id: number): void {
    // Relative to this route (/products/:id): '..' goes up to /products, then adds the new id.
    void this.router.navigate(['..', id], { relativeTo: this.route });
  }
}
