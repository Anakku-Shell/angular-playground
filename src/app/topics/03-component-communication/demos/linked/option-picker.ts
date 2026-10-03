import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

/**
 * THE CHILD of the linked demo. It receives the options from the parent but owns the selection:
 * the parent never learns which option is picked.
 */
@Component({
  selector: 'app-option-picker',
  template: `
    <div class="options" role="radiogroup" [attr.aria-label]="label()">
      @for (option of options(); track option) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="option === selected()"
          [class.active]="option === selected()"
          (click)="selected.set(option)"
        >
          {{ option }}
        </button>
      }
    </div>
    <p class="summary">{{ summary() }}</p>
  `,
  styles: `
    .options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .active {
      border-color: var(--color-accent);
      background: var(--color-accent-soft);
      color: var(--color-accent);
    }

    .summary {
      margin: 0.5rem 0 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionPicker {
  // [1] The input: the list of options, set by the parent.
  readonly label = input.required<string>();
  readonly options = input.required<readonly string[]>();

  // [2] Local, writable state that starts from an input and resets when that input changes.
  // The template writes it with selected.set(option); a new options() list overrides that.
  // A plain `signal(this.options()[0])` would fail here: required inputs are not set yet while
  // the class fields initialize. The compiler catches it (NG8118); at runtime it is NG0950.
  protected readonly selected = linkedSignal(() => this.options()[0]);

  // [3] Read-only value derived from an input and local state. Compare: computed() cannot be
  // set(), linkedSignal() can.
  protected readonly summary = computed(
    () => `Selected ${this.selected()} (1 of ${this.options().length} options)`,
  );
}
