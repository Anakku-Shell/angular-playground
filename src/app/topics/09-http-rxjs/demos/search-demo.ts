import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { friendlyMessage } from '../../../core/http/http-errors';
import { Product, ProductsApi } from '../products-api';

/** Quiet time after the last keystroke before searching. */
export const SEARCH_DEBOUNCE_MS = 300;

/** [1] Every state the UI can be in, as one union: the template can never show two at once. */
type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly term: string }
  | {
      readonly status: 'success';
      readonly term: string;
      readonly products: Product[];
      readonly total: number;
    }
  | { readonly status: 'error'; readonly term: string; readonly message: string };

const IDLE: SearchState = { status: 'idle' };

/** Search-as-you-type: debounce the input, drop repeats, cancel stale requests. */
@Component({
  selector: 'app-search-demo',
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <label class="field">
      <span>Search products</span>
      <input
        type="search"
        class="search-input"
        [formControl]="query"
        placeholder="Try phone, laptop, apple…"
        autocomplete="off"
      />
    </label>
    <label class="check">
      <input type="checkbox" class="search-fail" [formControl]="failRequests" />
      Make requests fail (then change the search)
    </label>

    @let s = state();
    <div class="search-output" aria-live="polite">
      @if (s.status === 'idle') {
        <p class="hint search-status">Type at least 2 characters.</p>
      } @else if (s.status === 'loading') {
        <p class="loading search-status">Searching "{{ s.term }}"…</p>
      } @else if (s.status === 'error') {
        <p class="error search-status" role="alert">{{ s.message }}</p>
      } @else {
        <p class="hint search-status">{{ s.total }} results for "{{ s.term }}"</p>
        <ul class="results">
          @for (product of s.products; track product.id) {
            <li>
              {{ product.title }} <span class="muted">{{ product.price | currency }}</span>
            </li>
          } @empty {
            <li class="muted">No matches.</li>
          }
        </ul>
      }
    </div>
    <p class="hint">
      Requests sent: <code class="search-requests">{{ requests() }}</code>
    </p>
  `,
  styleUrl: './http-demo.scss',
  styles: `
    .field {
      display: grid;
      gap: 0.25rem;
      max-width: 24rem;

      > span {
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0 0.75rem;
    }

    .search-output {
      min-height: 2rem;
    }

    .results {
      margin: 0.5rem 0 0;
      padding-left: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDemo {
  private readonly api = inject(ProductsApi);

  protected readonly query = new FormControl('', { nonNullable: true });
  protected readonly failRequests = new FormControl(false, { nonNullable: true });
  protected readonly requests = signal(0);

  // [2] From keystrokes to UI states, one operator per line.
  private readonly state$: Observable<SearchState> = this.query.valueChanges.pipe(
    map((term) => term.trim()),
    // Wait until the user pauses typing: one request instead of one per keystroke.
    debounceTime(SEARCH_DEBOUNCE_MS),
    // "phone" → "phones" → "phone" within the debounce, or an added space: no new request.
    distinctUntilChanged(),
    // One letter matches almost everything; an empty box goes back to idle.
    filter((term) => term.length !== 1),
    // A new term unsubscribes from the previous request, which aborts it: an old, slow response
    // can never overwrite a newer one.
    switchMap((term) => (term ? this.search(term) : of(IDLE))),
  );

  // [4] toSignal subscribes now and unsubscribes when the component is destroyed.
  protected readonly state = toSignal(this.state$, { initialValue: IDLE });

  private search(term: string): Observable<SearchState> {
    this.requests.update((n) => n + 1);
    return this.api.search(term, this.failRequests.value).pipe(
      map((page): SearchState => ({ status: 'success', term, ...page })),
      // [3] catchError INSIDE switchMap: the error ends this inner request only. Outside, it would
      // complete the whole stream and the search box would stop working.
      catchError((error: unknown) =>
        of<SearchState>({
          status: 'error',
          term,
          message: error instanceof HttpErrorResponse ? friendlyMessage(error) : 'Unexpected error',
        }),
      ),
      startWith<SearchState>({ status: 'loading', term }),
    );
  }
}
