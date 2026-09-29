import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { ActivityLog } from './activity-log';
import { Ticker } from './ticker';

@Component({
  selector: 'app-ticker-panel',
  // A new Ticker per panel, destroyed together with the panel.
  providers: [Ticker],
  template: `Ticker #{{ ticker.id }}: <strong>{{ ticker.seconds() }}</strong> s`,
  styles: `
    :host {
      display: block;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerPanel {
  protected readonly ticker = inject(Ticker);

  constructor() {
    const log = inject(ActivityLog);
    // A component can use DestroyRef too, instead of implementing ngOnDestroy.
    inject(DestroyRef).onDestroy(() => log.add('TickerPanel: DestroyRef.onDestroy'));
  }
}
