import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { ActivityLog } from './activity-log';

let nextId = 0;

/**
 * Counts seconds with setInterval. Provided in a component's `providers`, so it is created
 * with that component and destroyed with it: the DestroyRef it injects is the component's.
 */
@Injectable()
export class Ticker {
  readonly id = ++nextId;

  private readonly elapsed = signal(0);
  readonly seconds = this.elapsed.asReadonly();

  constructor() {
    const log = inject(ActivityLog);
    const interval = setInterval(() => this.elapsed.update((n) => n + 1), 1000);
    log.add(`Ticker #${this.id}: created, interval started`);

    // Without this, the interval would keep running (and keep this object alive) forever.
    inject(DestroyRef).onDestroy(() => {
      clearInterval(interval);
      log.add(`Ticker #${this.id}: DestroyRef.onDestroy, interval cleared`);
    });
  }
}
