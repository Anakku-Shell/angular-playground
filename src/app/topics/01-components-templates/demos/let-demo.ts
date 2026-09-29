import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-let-demo',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './let-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetDemo {
  protected readonly quantity = signal(2);
  protected readonly unitPrice = 12.5;
  // Simulates data that arrives later (e.g. an HTTP call).
  protected readonly customer$ = of({ name: 'Grace Hopper', vip: true }).pipe(delay(1500));

  protected add(): void {
    this.quantity.update((q) => q + 1);
  }

  protected remove(): void {
    this.quantity.update((q) => Math.max(0, q - 1));
  }
}
