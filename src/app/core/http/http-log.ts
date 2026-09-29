import { Injectable, signal } from '@angular/core';

export interface HttpLogEntry {
  readonly id: number;
  readonly method: string;
  readonly url: string;
  /** HTTP status, 0 for a network error, or 'cancelled' when the subscriber unsubscribed first. */
  readonly status: number | 'cancelled';
  readonly ms: number;
  /** Whether the request carried an Authorization header. */
  readonly authorized: boolean;
}

/** Most entries kept (newest first). */
export const HTTP_LOG_SIZE = 20;

/** Every request of the app, written by the logging interceptor. */
@Injectable({ providedIn: 'root' })
export class HttpLog {
  private nextId = 1;
  private readonly _entries = signal<HttpLogEntry[]>([]);

  readonly entries = this._entries.asReadonly();

  add(entry: Omit<HttpLogEntry, 'id'>): void {
    const withId = { ...entry, id: this.nextId++ };
    this._entries.update((entries) => [withId, ...entries].slice(0, HTTP_LOG_SIZE));
  }

  clear(): void {
    this._entries.set([]);
  }
}
