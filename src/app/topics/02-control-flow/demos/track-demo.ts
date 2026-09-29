import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Fruit, TrackRow } from './track/track-row';

const NAMES = ['Apple', 'Banana', 'Cherry', 'Kiwi', 'Mango', 'Peach', 'Plum'];
const INITIAL: readonly Fruit[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

@Component({
  selector: 'app-track-demo',
  imports: [TrackRow],
  templateUrl: './track-demo.html',
  styleUrl: './track-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackDemo {
  protected readonly fruits = signal<readonly Fruit[]>(INITIAL);
  private nextId = INITIAL.length + 1;

  protected addToTop(): void {
    const id = this.nextId++;
    const name = NAMES[(id - 1) % NAMES.length];
    this.fruits.update((fruits) => [{ id, name }, ...fruits]);
  }

  protected reverse(): void {
    this.fruits.update((fruits) => [...fruits].reverse());
  }

  // Same data, new object references: what you get when a list is fetched again from a server.
  protected reload(): void {
    this.fruits.update((fruits) => fruits.map((fruit) => ({ ...fruit })));
  }

  protected reset(): void {
    this.nextId = INITIAL.length + 1;
    this.fruits.set(INITIAL.map((fruit) => ({ ...fruit })));
  }
}
