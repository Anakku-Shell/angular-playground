import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

/** App-wide HTTP error message, set by the error interceptor. A real app would show a toast. */
@Injectable({ providedIn: 'root' })
export class HttpErrors {
  private readonly _last = signal<string | null>(null);

  readonly last = this._last.asReadonly();

  report(error: HttpErrorResponse): void {
    this._last.set(`${error.status || 'Network'} · ${friendlyMessage(error)}`);
  }

  dismiss(): void {
    this._last.set(null);
  }
}

/** Turns an HTTP error into a message a user can read. */
export function friendlyMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Cannot reach the server. Check your connection.';
  if (error.status === 401 || error.status === 403) return 'You are not allowed to do that.';
  if (error.status === 404) return 'Not found.';
  if (error.status >= 500) return 'The server failed. Try again later.';
  return 'The request failed.';
}
