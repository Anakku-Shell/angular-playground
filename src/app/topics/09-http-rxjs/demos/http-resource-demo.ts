import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Product, ProductsApi } from '../products-api';

/*
 * httpResource variants:
 *   httpResource<T>(() => url)                       JSON
 *   httpResource<T>(() => ({ url, method, params, headers, body }))   a full request
 *   httpResource.text / .blob / .arrayBuffer(...)    other response types
 * Options: defaultValue, parse (validate or transform the JSON), equal, injector.
 */

/** httpResource: an HTTP GET driven by a signal, with its state exposed as signals. */
@Component({
  selector: 'app-http-resource-demo',
  imports: [CurrencyPipe],
  template: `
    <div class="demo-row" role="group" aria-label="Product id">
      <span>Product id</span>
      @for (id of ids; track id) {
        <button type="button" [attr.aria-pressed]="id === productId()" (click)="productId.set(id)">
          {{ id }}
        </button>
      }
      <button type="button" (click)="product.reload()">Reload</button>
    </div>

    <dl class="demo-values">
      <dt>status()</dt>
      <dd class="resource-status">{{ product.status() }}</dd>
      <dt>statusCode()</dt>
      <dd class="resource-code">{{ product.statusCode() ?? '–' }}</dd>
      <dt>Result</dt>
      <dd class="resource-result">
        <!-- Check error() before value(): reading value() of a failed resource throws. -->
        @if (product.isLoading()) {
          <span class="loading">Loading…</span>
        } @else if (product.error(); as error) {
          <span class="error">{{ error.message }}</span>
        } @else if (product.hasValue()) {
          {{ product.value().title }} ({{ product.value().price | currency }})
        }
      </dd>
    </dl>
  `,
  styleUrl: './http-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpResourceDemo {
  private readonly api = inject(ProductsApi);

  /** 999 does not exist: the API answers 404. */
  protected readonly ids = [1, 2, 3, 999];
  protected readonly productId = signal(1);

  // httpResource is experimental in v21. The URL function is reactive: when productId() changes,
  // the previous request is aborted and a new one starts. It goes through HttpClient, so the
  // interceptors run (see the log above). Returning undefined from the function skips the request.
  protected readonly product = httpResource<Product>(() => this.api.productUrl(this.productId()));
}
