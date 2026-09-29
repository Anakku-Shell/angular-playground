import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface User {
  name: string;
  email: string | null;
}

@Component({
  selector: 'app-interpolation-demo',
  templateUrl: './interpolation-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterpolationDemo {
  protected readonly user = signal<User>({ name: 'Ada Lovelace', email: null });
  protected readonly quantity = signal(3);
  protected readonly unitPrice = 4.5;
  // Derived value: recomputed only when `quantity` changes, not on every render.
  protected readonly total = computed(() => this.quantity() * this.unitPrice);
  // Interpolation always renders text: this markup shows up escaped, not bold.
  protected readonly markup = '<strong>not bold</strong>';

  protected add(): void {
    this.quantity.update((q) => q + 1);
  }

  protected remove(): void {
    this.quantity.update((q) => Math.max(0, q - 1));
  }

  protected toggleEmail(): void {
    this.user.update((u) => ({ ...u, email: u.email ? null : 'ada@example.com' }));
  }
}
