import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Module-level counter: every new TrackRow instance takes the next number. When Angular reuses
// a row, its number stays; when it recreates the row, a new number appears.
let instancesCreated = 0;

export interface Fruit {
  readonly id: number;
  readonly name: string;
}

@Component({
  selector: 'app-track-row',
  template: `
    <span class="instance" title="Component instance number">#{{ instance }}</span>
    <span class="name">{{ fruit().name }}</span>
    <!-- An uncontrolled input: what you type lives only in this DOM element. -->
    <input type="text" placeholder="type here" [attr.aria-label]="'Note for ' + fruit().name" />
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 2.5rem 4.5rem minmax(0, 1fr);
      align-items: center;
      gap: 0.35rem;
    }

    .instance {
      color: var(--color-text-muted);
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    input {
      width: 100%;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackRow {
  readonly fruit = input.required<Fruit>();
  protected readonly instance = ++instancesCreated;
}
