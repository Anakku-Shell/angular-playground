import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CatalogStore } from '../stores/catalog-store';

/** Async side effects in a SignalStore: search-as-you-type with rxMethod. */
@Component({
  selector: 'app-rx-method-demo',
  imports: [CurrencyPipe],
  providers: [CatalogStore],
  template: `
    <div class="demo-row">
      <label class="field">
        <span>Search the catalog</span>
        <input
          type="search"
          class="catalog-query"
          placeholder="Try mo, key, head…"
          autocomplete="off"
          [value]="store.query()"
          (input)="setQuery($event)"
        />
      </label>
      <label class="check">
        <input
          type="checkbox"
          class="catalog-fail"
          [checked]="store.failRequests()"
          (change)="setFail($event)"
        />
        Make requests fail (then change the search)
      </label>
    </div>

    <div class="catalog-output" aria-live="polite">
      @switch (store.status()) {
        @case ('loading') {
          <p class="loading catalog-status">Searching…</p>
        }
        @case ('error') {
          <p class="error catalog-status" role="alert">{{ store.error() }}</p>
        }
        @default {
          <p class="hint catalog-status">
            {{ store.resultCount() }} {{ store.resultCount() === 1 ? 'product' : 'products' }}
          </p>
          <ul class="results">
            @for (product of store.products(); track product.id) {
              <li>
                {{ product.name }}
                <span class="hint">{{ product.price | currency: 'EUR' }}</span>
              </li>
            }
          </ul>
        }
      }
    </div>
    <p class="hint">
      Requests sent: <code class="catalog-requests">{{ store.requests() }}</code>
    </p>
  `,
  styleUrl: './state-demo.scss',
  styles: `
    .field {
      display: grid;
      gap: 0.25rem;

      > span {
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .catalog-output {
      min-height: 2rem;
      margin: 0.75rem 0 0.5rem;
    }

    .results {
      margin: 0.35rem 0 0;
      padding-left: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxMethodDemo {
  protected readonly store = inject(CatalogStore);

  protected setQuery(event: Event): void {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }

  protected setFail(event: Event): void {
    this.store.setFailRequests((event.target as HTMLInputElement).checked);
  }
}
