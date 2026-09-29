import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { QuantityStepper } from './model/quantity-stepper';

@Component({
  selector: 'app-model-demo',
  imports: [QuantityStepper],
  templateUrl: './model-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelDemo {
  protected readonly quantity = signal(2);
}
