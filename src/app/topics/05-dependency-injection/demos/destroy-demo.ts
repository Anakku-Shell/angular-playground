import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ActivityLog } from './destroy/activity-log';
import { TickerPanel } from './destroy/ticker-panel';

/*
 * Cleaning up when something is destroyed:
 *   inject(DestroyRef).onDestroy(fn)   components, directives, services (used here)
 *   takeUntilDestroyed()               RxJS: completes a stream on destroy
 *   ngOnDestroy() { ... }              the lifecycle hook (components, directives, services)
 * A service is destroyed with the injector that created it: a component's, or the app's.
 */
@Component({
  selector: 'app-destroy-demo',
  imports: [TickerPanel],
  providers: [ActivityLog],
  template: `
    <div class="demo-row">
      <button type="button" [attr.aria-pressed]="mounted()" (click)="toggle()">
        {{ mounted() ? 'Unmount ticker' : 'Mount ticker' }}
      </button>
      <button type="button" (click)="log.clear()">Clear log</button>
    </div>

    @if (mounted()) {
      <app-ticker-panel class="ticker" />
    }

    <ul class="log activity-log">
      @for (entry of log.entries(); track $index) {
        <li>{{ entry }}</li>
      } @empty {
        <li class="muted">empty</li>
      }
    </ul>
  `,
  styles: `
    .ticker {
      margin-top: 0.75rem;
    }
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestroyDemo {
  protected readonly log = inject(ActivityLog);
  protected readonly mounted = signal(true);

  protected toggle(): void {
    this.mounted.update((mounted) => !mounted);
  }
}
