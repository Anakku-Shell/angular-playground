import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Point {
  readonly x: number;
  readonly y: number;
}

const samePoint = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;
const format = (p: Point): string => `(${p.x}, ${p.y})`;

@Component({
  selector: 'app-equality-demo',
  templateUrl: './equality-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EqualityDemo {
  // [1] Default equality is Object.is: a new object is always a change, even with the same fields.
  protected readonly byReference = signal<Point>({ x: 0, y: 0 });
  // [2] A custom `equal`: setting an equal value is ignored, so nothing that depends on it reruns.
  protected readonly byValue = signal<Point>({ x: 0, y: 0 }, { equal: samePoint });

  // Plain counters (as in the computed demo): they number the runs of each computed().
  private referenceRuns = 0;
  private valueRuns = 0;
  protected readonly referenceLabel = computed(() => ({
    text: format(this.byReference()),
    run: ++this.referenceRuns,
  }));
  protected readonly valueLabel = computed(() => ({
    text: format(this.byValue()),
    run: ++this.valueRuns,
  }));

  protected setEqualCopy(): void {
    // [3] Same fields, different object: only byReference notifies.
    this.byReference.set({ ...this.byReference() });
    this.byValue.set({ ...this.byValue() });
  }

  protected moveRight(): void {
    this.byReference.update((p) => ({ ...p, x: p.x + 1 }));
    this.byValue.update((p) => ({ ...p, x: p.x + 1 }));
  }
}
