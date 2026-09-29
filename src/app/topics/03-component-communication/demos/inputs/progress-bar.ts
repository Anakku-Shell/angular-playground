import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div
      class="track"
      role="progressbar"
      aria-valuemin="0"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-label]="label()"
    >
      <div class="fill" [class.striped]="striped()" [style.width.%]="percent()"></div>
    </div>
    <span class="caption">{{ label() }}: {{ value() }} / {{ max() }} ({{ percent() }}%)</span>
  `,
  styles: `
    :host {
      display: grid;
      gap: 0.25rem;
    }

    .track {
      height: 0.75rem;
      border-radius: var(--radius);
      background: var(--color-hover);
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: var(--color-accent);
      transition: width 0.2s;
    }

    .striped {
      background-image: repeating-linear-gradient(
        45deg,
        transparent 0 6px,
        rgb(255 255 255 / 35%) 6px 12px
      );
    }

    .caption {
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  // Required: using <app-progress-bar> without `value` is a template compile error.
  // numberAttribute turns the attribute string "3" into 3 (and "abc" into NaN).
  readonly value = input.required({ transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  // booleanAttribute: a bare attribute (`striped`) or "true" gives true; no attribute or
  // "false" gives false. Without it, `<app-progress-bar striped>` would pass the string ''.
  readonly striped = input(false, { transform: booleanAttribute });
  // alias: templates write `caption="..."`, the class reads `label()`. The style guide (and the
  // lint rule disabled below) discourages aliases; this line only shows the option.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly label = input('Progress', { alias: 'caption' });

  // Inputs are read-only signals: derive values from them with computed().
  protected readonly percent = computed(() => {
    const ratio = this.value() / this.max();
    return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  });
}
