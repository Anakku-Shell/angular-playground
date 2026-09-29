import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, interval, map } from 'rxjs';

const API_NAMES = [
  'signal',
  'computed',
  'effect',
  'linkedSignal',
  'untracked',
  'resource',
  'rxResource',
  'httpResource',
  'toSignal',
  'toObservable',
  'outputFromObservable',
  'outputToObservable',
  'takeUntilDestroyed',
  'input',
  'model',
  'output',
  'viewChild',
  'contentChild',
];

export const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-interop-demo',
  templateUrl: './interop-demo.html',
  styleUrls: ['./signals-demo.scss', './interop-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteropDemo {
  protected readonly query = signal('');

  // Signal → Observable (toObservable) → RxJS operators → back to a signal (toSignal).
  // Both need an injection context; toSignal unsubscribes when the component is destroyed.
  protected readonly debouncedQuery = toSignal(
    toObservable(this.query).pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      map((q) => q.trim().toLowerCase()),
      distinctUntilChanged(),
    ),
    // Without initialValue the signal type would include `undefined` until the first emission.
    { initialValue: '' },
  );

  protected readonly matches = computed(() =>
    API_NAMES.filter((name) => name.toLowerCase().includes(this.debouncedQuery())),
  );

  // Any Observable becomes a signal: here a timer that ticks every second.
  protected readonly secondsHere = toSignal(interval(1000).pipe(map((n) => n + 1)), {
    initialValue: 0,
  });

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
