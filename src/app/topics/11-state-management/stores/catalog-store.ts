import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

import { CatalogApi, Product } from '../catalog';

/** Quiet time after the last keystroke before searching. */
export const CATALOG_DEBOUNCE_MS = 300;

interface CatalogState {
  readonly query: string;
  readonly failRequests: boolean;
  readonly products: readonly Product[];
  readonly status: 'loading' | 'loaded' | 'error';
  readonly error: string | null;
  readonly requests: number;
}

// [1] Everything the search UI needs, in one state object.
const initialState: CatalogState = {
  query: '',
  failRequests: false,
  products: [],
  status: 'loading',
  error: null,
  requests: 0,
};

/** Product search with async side effects handled by rxMethod. */
export const CatalogStore = signalStore(
  withState(initialState),
  withComputed(({ products, status }) => ({
    isLoading: computed(() => status() === 'loading'),
    resultCount: computed(() => products().length),
  })),
  withMethods((store, api = inject(CatalogApi)) => ({
    setQuery(query: string): void {
      patchState(store, { query });
    },
    setFailRequests(failRequests: boolean): void {
      patchState(store, { failRequests });
    },
    // [2] rxMethod turns an RxJS pipeline into a method. It accepts a plain value, a signal or an
    // Observable; with a signal, every new value goes through the pipeline.
    search: rxMethod<string>(
      pipe(
        map((query) => query.trim()),
        debounceTime(CATALOG_DEBOUNCE_MS),
        // An added space or the same term typed again within the debounce: no new request.
        distinctUntilChanged(),
        tap(() =>
          patchState(store, (state) => ({
            status: 'loading' as const,
            error: null,
            requests: state.requests + 1,
          })),
        ),
        // switchMap cancels the previous request when a new query arrives.
        switchMap((query) =>
          api.search(query, store.failRequests()).pipe(
            tap((products) => patchState(store, { products, status: 'loaded' })),
            // [3] Handle the error INSIDE switchMap: an error reaching the rxMethod pipeline would
            // end it, and the search would stop reacting.
            catchError((error: unknown) => {
              const message = error instanceof Error ? error.message : 'Unexpected error';
              patchState(store, { products: [], status: 'error', error: message });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
  // Hooks run when the store is created and destroyed (with its injector).
  withHooks({
    onInit(store) {
      // [4] Pass the query SIGNAL, not its value: the search re-runs whenever the query changes,
      // and the subscription ends when the store is destroyed.
      store.search(store.query);
    },
  }),
);
