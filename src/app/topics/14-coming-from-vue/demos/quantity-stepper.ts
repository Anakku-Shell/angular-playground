import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

/*
 * THE CHILD. Everything a Vue child declares with macros, Angular declares with functions:
 *
 *   QuantityStepper.vue                          Angular (this file)
 *   const value = defineModel<number>()          readonly value = model(0)
 *   defineProps<{ max?: number }>()              readonly max = input(10)
 *   const emit = defineEmits(['limit'])          readonly limit = output<number>()
 *   <slot />                                     <ng-content />
 *
 * Read next: parent-child-demo.ts, the parent that uses it.
 */

/** A − / + stepper with a two-way value, a max, a "limit reached" event and a projected label. */
@Component({
  selector: 'app-quantity-stepper',
  template: `
    <!-- [4] The parent's content lands here, like Vue's <slot />. -->
    <span class="label"><ng-content /></span>
    <button type="button" (click)="change(-1)" [disabled]="value() === 0" aria-label="Less">
      −
    </button>
    <output class="value">{{ value() }}</output>
    <button type="button" (click)="change(1)" aria-label="More">+</button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .label {
      min-width: 6rem;
    }

    .value {
      min-width: 1.5rem;
      text-align: center;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepper {
  // [1] defineModel → model(): a signal the child can write. The parent binds it with [(value)].
  readonly value = model(0);
  // [2] defineProps → input(): read-only for the child. `input.required<T>()` has no default.
  readonly max = input(10);
  // [3] defineEmits → output(): the parent listens with (limit)="…".
  readonly limit = output<number>();

  protected change(delta: number): void {
    const next = this.value() + delta;
    if (next > this.max()) {
      this.limit.emit(this.max());
      return;
    }
    // Writing a model() updates the parent's signal too. Vue: value.value = next.
    this.value.set(Math.max(0, next));
  }
}
