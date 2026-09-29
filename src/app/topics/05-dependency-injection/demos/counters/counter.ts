import { Injectable, signal } from '@angular/core';

// Numbers every instance, so the demos can show which one a component received.
let nextId = 0;

/**
 * `providedIn: 'root'`: one instance for the whole app, created the first time something
 * injects it, and left out of the bundle if nothing does (tree-shakable). A component can
 * still list `Counter` in its `providers` to get its own instance instead.
 */
@Injectable({ providedIn: 'root' })
export class Counter {
  readonly id = ++nextId;

  private readonly value = signal(0);
  readonly count = this.value.asReadonly();

  increment(): void {
    this.value.update((n) => n + 1);
  }
}
