import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TemperatureStore } from '../subjects/temperature-store';

/** Two inputs over one store: typing in either unit updates the other. */
@Component({
  selector: 'app-temperature-demo',
  template: `
    <div class="demo-row">
      <label>
        °C
        <input
          class="celsius"
          type="number"
          step="0.1"
          [value]="store.celsius()"
          (input)="store.setCelsius($any($event.target).valueAsNumber || 0)"
        />
      </label>
      <label>
        °F
        <input
          class="fahrenheit"
          type="number"
          step="0.1"
          [value]="store.fahrenheit()"
          (input)="store.setFahrenheit($any($event.target).valueAsNumber || 0)"
        />
      </label>
      <span class="feel" [attr.data-feel]="store.feel()">Feels {{ store.feel() }}</span>
    </div>
  `,
  styles: `
    input {
      width: 6rem;
    }

    .feel {
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      border: 1px solid var(--color-border);
    }

    [data-feel='hot'] {
      color: var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemperatureDemo {
  protected readonly store = inject(TemperatureStore);
}
