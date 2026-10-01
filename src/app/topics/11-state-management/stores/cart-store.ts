import { computed, Injectable, signal } from '@angular/core';

import { addLine, CartLine, countItems, Product, removeLine, totalPrice } from '../catalog';

/*
 * Where state can live, from smallest to largest:
 *   signals in a component        state only that component uses
 *   signalState() (NgRx)          one local state object with patchState (last card)
 *   a service with signals        shared state with plain Angular (this file)
 *   signalStore() (NgRx)          the same, with a standard structure and plugins (next card)
 *   NgRx Store (@ngrx/store)      the classic Redux pattern: actions, reducers, selectors and
 *                                 effects. Common in larger v19 codebases; not used here.
 */

/**
 * A store with nothing but Angular signals:
 * - state lives in a private writable signal, so only this class can change it;
 * - components read a readonly view and computed values;
 * - public methods are the "actions": the only way to change the state.
 *
 * `providedIn: 'root'`: one instance for the whole app, so the cart survives navigation and
 * every component that injects it sees the same data.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly linesState = signal<readonly CartLine[]>([]);

  readonly lines = this.linesState.asReadonly();
  readonly count = computed(() => countItems(this.lines()));
  readonly total = computed(() => totalPrice(this.lines()));
  readonly isEmpty = computed(() => this.lines().length === 0);

  add(product: Product): void {
    // update() with a new array: signals compare with ===, so mutating the old array in place
    // would not notify anyone.
    this.linesState.update((lines) => addLine(lines, product));
  }

  remove(productId: number): void {
    this.linesState.update((lines) => removeLine(lines, productId));
  }

  clear(): void {
    this.linesState.set([]);
  }
}
