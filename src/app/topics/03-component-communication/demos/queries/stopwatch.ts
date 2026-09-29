import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

/** A child with a public API (methods and read-only signals) that a parent reaches via a query. */
@Component({
  selector: 'app-stopwatch',
  template: `
    <span class="name">{{ name() }}</span>
    <span class="time" [class.running]="running()">{{ (elapsedMs() / 1000).toFixed(1) }} s</span>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    .time {
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
    }

    .running {
      color: var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stopwatch {
  readonly name = input.required<string>();

  private readonly elapsed = signal(0);
  private readonly isRunning = signal(false);
  // Public read-only views: the parent can read them but not set() them.
  readonly elapsedMs = this.elapsed.asReadonly();
  readonly running = this.isRunning.asReadonly();

  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor() {
    // Stop the interval when the component is destroyed (e.g. its lane is removed).
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  start(): void {
    if (this.intervalId !== undefined) return;
    this.isRunning.set(true);
    this.intervalId = setInterval(() => this.elapsed.update((ms) => ms + 100), 100);
  }

  stop(): void {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.isRunning.set(false);
  }

  reset(): void {
    this.stop();
    this.elapsed.set(0);
  }
}
