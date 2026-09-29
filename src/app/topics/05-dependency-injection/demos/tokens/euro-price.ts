import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DEFAULT_CURRENCY_CODE, input } from '@angular/core';

/**
 * Overrides one of Angular's own tokens for this component and its children: the `currency`
 * pipe injects DEFAULT_CURRENCY_CODE from the element where it is used, so here it gets EUR.
 */
@Component({
  selector: 'app-euro-price',
  imports: [CurrencyPipe],
  providers: [{ provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }],
  template: `{{ amount() | currency }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EuroPrice {
  readonly amount = input.required<number>();
}
