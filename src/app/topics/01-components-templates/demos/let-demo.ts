import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-let-demo',
  // Pipes used in the template are imported like components. Forget one and the build fails
  // with "No pipe found with name 'currency'".
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './let-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetDemo {
  protected readonly quantity = signal(2);
  protected readonly unitPrice = 12.5;
  // Simulates data that arrives later (e.g. an HTTP call). The `$` suffix is a convention for
  // Observables: it tells the reader to subscribe (here, with the async pipe).
  protected readonly customer$ = of({ name: 'Grace Hopper', vip: true }).pipe(delay(1500));

  protected add(): void {
    this.quantity.update((q) => q + 1);
  }

  protected remove(): void {
    this.quantity.update((q) => Math.max(0, q - 1));
  }
}
