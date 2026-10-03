import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { QuantityStepper } from './model/quantity-stepper';

/** The parent of the model demo: one signal, bound two-way to one stepper, one-way to the other. */
@Component({
  selector: 'app-model-demo',
  imports: [QuantityStepper],
  templateUrl: './model-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelDemo {
  protected readonly quantity = signal(2);
}
