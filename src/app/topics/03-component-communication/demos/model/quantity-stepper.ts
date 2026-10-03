import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * THE CHILD of the model demo: a form-like control that changes its own value. Read this file
 * first, then model-demo.html.
 */
@Component({
  selector: 'app-quantity-stepper',
  template: `
    <button type="button" aria-label="Decrease" [disabled]="value() <= min()" (click)="step(-1)">
      −
    </button>
    <output class="value">{{ value() }}</output>
    <button type="button" aria-label="Increase" [disabled]="value() >= max()" (click)="step(1)">
      +
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .value {
      min-width: 1.5rem;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepper {
  // [1] model() is a writable input: the child can set() it, and every change is also emitted as
  // the `valueChange` output. That pair is what `[(value)]` binds to.
  readonly value = model(1);
  readonly min = input(0);
  readonly max = input(10);

  // [2] The child writes its model like any signal. With [(value)] in the parent, this also
  // updates the parent's signal; with a one-way [value], only this copy changes.
  protected step(delta: number): void {
    this.value.update((current) => current + delta);
  }
}
