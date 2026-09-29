import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-basics-demo',
  imports: [CurrencyPipe],
  templateUrl: './basics-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicsDemo {
  protected readonly unitPrice = 12.5;
  protected readonly quantity = signal(1);
  protected readonly showTotal = signal(false);

  // A plain field, not a signal: a computed() must not write signals. It numbers the runs so
  // the demo can show when the computation actually executes.
  private runs = 0;
  protected readonly total = computed(() => ({
    amount: this.quantity() * this.unitPrice,
    run: ++this.runs,
  }));

  protected add(step: number): void {
    // update(): the new value is derived from the current one.
    this.quantity.update((current) => Math.max(0, current + step));
  }

  protected reset(): void {
    // set(): the new value does not depend on the current one.
    this.quantity.set(1);
  }

  protected toggleTotal(): void {
    this.showTotal.update((shown) => !shown);
  }
}
