import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { HttpErrors } from '../../../core/http/http-errors';
import { HttpLog } from '../../../core/http/http-log';
import { ProductsApi } from '../products-api';

/** A public API on another host: the auth interceptor must not send it our token. */
export const OTHER_HOST_URL = 'https://jsonplaceholder.typicode.com/todos/1';

/** Sends requests through the app's interceptor chain and shows what each interceptor did. */
@Component({
  selector: 'app-interceptors-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="send('Product 1', api.getById(1))">GET /products/1</button>
      <button type="button" (click)="send('404', api.status(404))">GET /http/404</button>
      <button type="button" (click)="send('503 + retry', api.unavailable())">
        GET /http/503 (retry ×2)
      </button>
      <button type="button" (click)="send('Other host', http.get(otherHostUrl))">
        GET another host
      </button>
    </div>
    <p class="hint interceptor-result" aria-live="polite">{{ result() || 'Send a request.' }}</p>

    @if (errors.last(); as message) {
      <div class="demo-row global-error" role="alert">
        <span class="error">Error interceptor: {{ message }}</span>
        <button type="button" (click)="errors.dismiss()">Dismiss</button>
      </div>
    }

    <div class="table-scroll">
      <table class="http-log">
        <thead>
          <tr>
            <th>Method</th>
            <th>URL</th>
            <th>Status</th>
            <th>Time</th>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          @for (entry of log.entries(); track entry.id) {
            <tr>
              <td>{{ entry.method }}</td>
              <td class="url">{{ entry.url }}</td>
              <td class="status">{{ entry.status }}</td>
              <td>{{ entry.ms }} ms</td>
              <td class="token">{{ entry.authorized ? 'yes' : 'no' }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="muted">No requests yet.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="demo-row">
      <button type="button" (click)="log.clear()">Clear log</button>
      <span class="hint">The log is app-wide: requests from the other demos show up too.</span>
    </div>
  `,
  styleUrl: './http-demo.scss',
  styles: `
    .global-error {
      margin-top: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterceptorsDemo {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly api = inject(ProductsApi);
  protected readonly http = inject(HttpClient);
  protected readonly log = inject(HttpLog);
  protected readonly errors = inject(HttpErrors);

  protected readonly otherHostUrl = OTHER_HOST_URL;
  protected readonly result = signal('');

  protected send(label: string, request$: Observable<unknown>): void {
    this.result.set(`${label}: waiting…`);
    request$
      // HttpClient completes after one response, so this is only about leaving the page while a
      // request is in flight: unsubscribing aborts it.
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.result.set(`${label}: OK`),
        error: (error: unknown) => {
          const status = error instanceof HttpErrorResponse ? error.status : '?';
          this.result.set(`${label}: failed with ${status} (the caller got the error too)`);
        },
      });
  }
}
