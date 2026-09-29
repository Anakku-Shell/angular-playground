import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { HoldButton } from './interop/hold-button';

@Component({
  selector: 'app-output-observable-demo',
  imports: [HoldButton],
  template: `
    <div class="demo-row">
      <app-hold-button duration="800" (held)="onHeld($event)">Hold to confirm</app-hold-button>
    </div>
    <dl class="demo-values">
      <dt>Confirmations</dt>
      <dd class="confirmations">{{ confirmations() }}</dd>
      <dt>Last event</dt>
      <dd>{{ lastEvent() }}</dd>
    </dl>
  `,
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputObservableDemo {
  protected readonly confirmations = signal(0);
  protected readonly lastEvent = signal('None yet: press and hold the button.');

  protected onHeld(ms: number): void {
    this.confirmations.update((n) => n + 1);
    this.lastEvent.set(`(held) → ${ms}`);
  }
}
