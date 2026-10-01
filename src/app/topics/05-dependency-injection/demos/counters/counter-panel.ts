import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { Counter } from './counter';

/** Shows the Counter instance it received. It never says which one: its injector decides. */
@Component({
  selector: 'app-counter-panel',
  template: `
    <span class="label">{{ label() }}</span>
    <span class="instance">Counter #{{ counter.id }}</span>
    <span class="count">count {{ counter.count() }}</span>
    <button type="button" (click)="counter.increment()">+1</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem 0.75rem;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
    }

    .label {
      font-weight: 600;
    }

    .instance {
      font-family: var(--font-mono);
      color: var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterPanel {
  readonly label = input.required<string>();
  // Older code asks through the constructor instead, with the same result:
  //   constructor(private readonly counter: Counter) {}
  protected readonly counter = inject(Counter);
}
