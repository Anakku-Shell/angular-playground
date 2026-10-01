import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction, shareReplay, tap } from 'rxjs';

import { ProductsApi } from '../products-api';

/** Products each stream loads. */
export const SHARED_LIMIT = 3;

/** Counts subscriptions to the source. For an HttpClient Observable, one subscription = one request. */
function countRequests<T>(counter: WritableSignal<number>): MonoTypeOperatorFunction<T> {
  return tap({ subscribe: () => counter.update((n) => n + 1) });
}

/*
 * An HttpClient Observable is cold: each subscriber sends its own request. To share one:
 *   share()                        share while subscribers overlap; late ones start a new request
 *   shareReplay({ bufferSize: 1 }) also replay the last value to late subscribers (a cache)
 *   a signal or resource           keep the value in state and read it from there
 */

/** The async pipe and toSignal on the same stream, with and without shareReplay. */
@Component({
  selector: 'app-shared-request-demo',
  imports: [AsyncPipe],
  template: `
    <dl class="demo-values">
      <dt><code>cold$ | async</code></dt>
      <dd class="cold-async">{{ (cold$ | async)?.length ?? '…' }} products</dd>
      <dt><code>toSignal(cold$)</code></dt>
      <dd>{{ coldProducts()?.length ?? '…' }} products</dd>
      <dt>HTTP requests</dt>
      <dd class="cold-requests">{{ coldRequests() }}</dd>

      <dt><code>shared$ | async</code></dt>
      <dd>{{ (shared$ | async)?.length ?? '…' }} products</dd>
      <dt><code>toSignal(shared$)</code></dt>
      <dd>{{ sharedProducts()?.length ?? '…' }} products</dd>
      <dt>HTTP requests</dt>
      <dd class="shared-requests">{{ sharedRequests() }}</dd>
    </dl>
    <ul class="log shared-titles">
      @for (product of sharedProducts(); track product.id) {
        <li>{{ product.title }}</li>
      } @empty {
        <li class="muted">Loading…</li>
      }
    </ul>
  `,
  styleUrl: './http-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedRequestDemo {
  private readonly api = inject(ProductsApi);

  protected readonly coldRequests = signal(0);
  protected readonly sharedRequests = signal(0);

  // Cold: every subscriber runs the Observable again, so each one sends its own request.
  protected readonly cold$ = this.api.list(SHARED_LIMIT).pipe(countRequests(this.coldRequests));

  // shareReplay: the first subscriber starts the request, later ones share it and get the last
  // value replayed. refCount: true drops the shared subscription when nobody listens any more.
  protected readonly shared$ = this.api
    .list(SHARED_LIMIT)
    .pipe(countRequests(this.sharedRequests), shareReplay({ bufferSize: 1, refCount: true }));

  // No initialValue: the signal holds undefined until the response arrives.
  protected readonly coldProducts = toSignal(this.cold$);
  protected readonly sharedProducts = toSignal(this.shared$);
}
