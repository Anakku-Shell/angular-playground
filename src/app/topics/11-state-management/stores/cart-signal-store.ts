import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { addLine, CartLine, countItems, Product, removeLine, totalPrice } from '../catalog';

interface CartState {
  readonly lines: readonly CartLine[];
}

const initialState: CartState = { lines: [] };

/**
 * The same cart as `CartStore`, built with NgRx SignalStore. `signalStore()` returns a class
 * made of features, applied in order; each one can use what the previous ones added.
 *
 * No `providedIn` option: the store is provided where it is needed (`providers: [...]` of a
 * component), so each provider gets its own instance, destroyed with that component.
 */
export const CartSignalStore = signalStore(
  // [1] State: every property becomes a readonly signal (store.lines()). Only patchState() can
  // change it, and by default only from inside the store (protectedState: true).
  withState(initialState),
  // [2] Derived state, from the state signals above.
  withComputed(({ lines }) => ({
    count: computed(() => countItems(lines())),
    total: computed(() => totalPrice(lines())),
    isEmpty: computed(() => lines().length === 0),
  })),
  // [3] Methods: the actions. patchState takes a partial state or an updater function, and always
  // replaces the state with a new object (immutable updates).
  withMethods((store) => ({
    add(product: Product): void {
      patchState(store, (state) => ({ lines: addLine(state.lines, product) }));
    },
    remove(productId: number): void {
      patchState(store, (state) => ({ lines: removeLine(state.lines, productId) }));
    },
    clear(): void {
      patchState(store, initialState);
    },
  })),
);
