import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';

import { PRODUCTS } from '../catalog';

type SortKey = 'name' | 'price';

/** Local component state as one object with signalState. */
@Component({
  selector: 'app-signal-state-demo',
  imports: [CurrencyPipe],
  template: `
    <div class="demo-row">
      <label>
        Max price:
        <strong class="max-price">{{ state.filters.maxPrice() | currency: 'EUR' }}</strong>
        <input
          type="range"
          class="max-price-range"
          min="0"
          max="200"
          step="10"
          [value]="state.filters.maxPrice()"
          (input)="setMaxPrice($event)"
        />
      </label>
      <label>
        Sort by
        <select class="sort" [value]="state.filters.sortBy()" (change)="setSort($event)">
          <option value="name">name</option>
          <option value="price">price</option>
        </select>
      </label>
      <button type="button" class="reset" (click)="reset()">Reset</button>
    </div>
    <ul class="visible">
      @for (product of visible(); track product.id) {
        <li>
          {{ product.name }} <span class="hint">{{ product.price | currency: 'EUR' }}</span>
        </li>
      } @empty {
        <li class="hint">Nothing that cheap.</li>
      }
    </ul>
    <p class="hint">
      Changes so far: <code class="changes">{{ state.changes() }}</code>
    </p>
  `,
  styleUrl: './state-demo.scss',
  styles: `
    label {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .visible {
      margin: 0.75rem 0 0.5rem;
      padding-left: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalStateDemo {
  // [1] signalState: a state object without a store class. Nested objects become "deep signals":
  // state.filters() is the object, state.filters.maxPrice() a single field.
  protected readonly state = signalState({
    filters: { maxPrice: 200, sortBy: 'name' as SortKey },
    changes: 0,
  });

  // [2] A plain computed() over the state signals.
  protected readonly visible = computed(() => {
    const { maxPrice, sortBy } = this.state.filters();
    return PRODUCTS.filter((p) => p.price <= maxPrice).sort((a, b) =>
      sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name),
    );
  });

  protected setMaxPrice(event: Event): void {
    const maxPrice = Number((event.target as HTMLInputElement).value);
    // [3] patchState merges one level deep, so nested objects are spread by hand.
    patchState(this.state, (s) => ({
      filters: { ...s.filters, maxPrice },
      changes: s.changes + 1,
    }));
  }

  protected setSort(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value as SortKey;
    patchState(this.state, (s) => ({ filters: { ...s.filters, sortBy }, changes: s.changes + 1 }));
  }

  protected reset(): void {
    patchState(this.state, { filters: { maxPrice: 200, sortBy: 'name' }, changes: 0 });
  }
}
