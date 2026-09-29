import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';

const METHODS = {
  Spain: ['Standard', 'Express', 'Pickup point'],
  Portugal: ['Standard', 'Express'],
  Andorra: ['Standard'],
} as const satisfies Record<string, readonly string[]>;

type Country = keyof typeof METHODS;

@Component({
  selector: 'app-linked-demo',
  templateUrl: './linked-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedDemo {
  protected readonly countries = Object.keys(METHODS) as Country[];
  protected readonly country = signal<Country>('Spain');
  protected readonly methods = computed<readonly string[]>(() => METHODS[this.country()]);

  // Writable (the user picks a method) and recomputed when `source` changes. `previous` holds the
  // last source and value, so the choice survives when the new country still offers it.
  protected readonly method = linkedSignal<readonly string[], string>({
    source: this.methods,
    computation: (methods, previous) =>
      previous && methods.includes(previous.value) ? previous.value : methods[0],
  });

  protected onCountry(event: Event): void {
    this.country.set((event.target as HTMLSelectElement).value as Country);
  }
}
