import { ChangeDetectionStrategy, Component, computed, signal, untracked } from '@angular/core';

@Component({
  selector: 'app-untracked-demo',
  templateUrl: './untracked-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntrackedDemo {
  protected readonly a = signal(1);
  protected readonly b = signal(10);

  // [1] Depends on a and b: any of them reruns it.
  protected readonly both = computed(() => this.a() + this.b());
  // [2] untracked(): reads b's current value without making it a dependency. Changing b alone does
  // not rerun this computed; the next change of a does, and picks up the latest b.
  protected readonly onlyA = computed(() => this.a() + untracked(this.b));

  protected bump(which: 'a' | 'b'): void {
    this[which].update((n) => n + 1);
  }
}
