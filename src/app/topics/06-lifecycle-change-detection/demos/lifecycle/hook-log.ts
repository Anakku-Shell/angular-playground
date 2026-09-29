import { Injectable, signal } from '@angular/core';

/** Provided by LifecycleDemo: the child writes to it from its hooks, the demo lists the lines. */
@Injectable()
export class HookLog {
  private readonly lines = signal<readonly string[]>([]);
  readonly entries = this.lines.asReadonly();

  add(message: string): void {
    this.lines.update((lines) => [...lines, message]);
  }

  clear(): void {
    this.lines.set([]);
  }
}
