import { Injectable, signal } from '@angular/core';

/** Provided by DestroyDemo, so the tickers inside it can report what happens to them. */
@Injectable()
export class ActivityLog {
  private readonly lines = signal<readonly string[]>([]);
  readonly entries = this.lines.asReadonly();

  add(message: string): void {
    this.lines.update((lines) => [...lines, message]);
  }

  clear(): void {
    this.lines.set([]);
  }
}
