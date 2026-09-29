import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Quote, QuoteApi } from '../subjects/quote-api';

/** Calls the real API; the specs answer the same requests with HttpTestingController. */
@Component({
  selector: 'app-quote-demo',
  template: `
    <div class="demo-row">
      <button type="button" class="next-quote" (click)="load()" [disabled]="loading()">
        {{ quote() ? 'Another quote' : 'Load a quote' }}
      </button>
      @if (loading()) {
        <span class="loading">Loading…</span>
      }
    </div>
    @if (error()) {
      <p class="error">{{ error() }}</p>
    } @else if (quote(); as quote) {
      <blockquote class="quote">
        <p>“{{ quote.quote }}”</p>
        <footer>— {{ quote.author }}</footer>
      </blockquote>
    }
  `,
  styles: `
    .loading {
      color: var(--color-warning);
    }

    .error {
      margin: 0.75rem 0 0;
      color: var(--color-accent);
    }

    .quote {
      margin: 0.75rem 0 0;
      padding-left: 1rem;
      border-left: 3px solid var(--color-border);

      p {
        margin: 0;
      }

      footer {
        color: var(--color-text-muted);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteDemo {
  private readonly api = inject(QuoteApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly quote = signal<Quote | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .random()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (quote) => {
          this.quote.set(quote);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load a quote.');
          this.loading.set(false);
        },
      });
  }
}
