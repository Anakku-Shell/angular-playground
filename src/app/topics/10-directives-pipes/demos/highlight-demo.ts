import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Highlight } from '../directives/highlight';

const COLORS = ['lightblue', 'pink', 'palegreen'] as const;

/** One attribute directive, three ways to configure it through its inputs. */
@Component({
  selector: 'app-highlight-demo',
  imports: [Highlight],
  template: `
    <fieldset class="choices">
      <legend>Color for the second box</legend>
      @for (option of colors; track option) {
        <label>
          <input
            type="radio"
            name="highlight-color"
            [value]="option"
            [checked]="color() === option"
            (change)="color.set(option)"
          />
          {{ option }}
        </label>
      }
    </fieldset>

    <p class="box default" appHighlight>
      <code>appHighlight</code>: no value, uses <code>defaultColor</code>.
    </p>
    <p class="box bound" [appHighlight]="color()">
      <code>[appHighlight]="color()"</code>: bound to the radio buttons ({{ color() }}).
    </p>
    <p class="box custom-default" appHighlight defaultColor="orange">
      <code>appHighlight defaultColor="orange"</code>: a second input.
    </p>
    <p class="hint">Hover each box.</p>
  `,
  styleUrl: './directives-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightDemo {
  protected readonly colors = COLORS;
  protected readonly color = signal<string>(COLORS[0]);
}
