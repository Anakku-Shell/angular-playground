import { computed, Injectable, signal } from '@angular/core';

export type Feel = 'cold' | 'mild' | 'hot';

const round1 = (value: number) => Math.round(value * 10) / 10;

/**
 * A small store: one writable signal (Celsius is the source of truth) and values derived from it.
 * Setting Fahrenheit converts back, so both units always agree.
 */
@Injectable({ providedIn: 'root' })
export class TemperatureStore {
  private readonly celsiusState = signal(20);

  readonly celsius = this.celsiusState.asReadonly();
  readonly fahrenheit = computed(() => round1((this.celsius() * 9) / 5 + 32));
  readonly feel = computed<Feel>(() => {
    const celsius = this.celsius();
    if (celsius < 10) return 'cold';
    return celsius < 25 ? 'mild' : 'hot';
  });

  setCelsius(celsius: number): void {
    this.celsiusState.set(round1(celsius));
  }

  setFahrenheit(fahrenheit: number): void {
    this.celsiusState.set(round1(((fahrenheit - 32) * 5) / 9));
  }
}
