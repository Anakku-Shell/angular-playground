import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardLink, MAP } from './card-view';

/**
 * "Previous / Next" links at the end of a single card, so a topic can be read in order.
 *
 * ```html
 * <app-card-pager [cards]="view.cards" [current]="card.id" />
 * ```
 */
@Component({
  selector: 'app-card-pager',
  imports: [RouterLink],
  template: `
    <nav class="pager" aria-label="Previous and next card">
      @if (previous(); as card) {
        <a [routerLink]="[]" [queryParams]="{ card: card.id }">← {{ card.label }}</a>
      } @else {
        <a [routerLink]="[]" [queryParams]="{ card: map }">← Map</a>
      }
      @if (next(); as card) {
        <a class="pager__next" [routerLink]="[]" [queryParams]="{ card: card.id }">
          {{ card.label }} →
        </a>
      }
    </nav>
  `,
  styles: `
    .pager {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
    }

    a {
      padding: 0.5rem 0.9rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      text-decoration: none;
    }

    .pager__next {
      margin-left: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPager {
  readonly cards = input.required<readonly CardLink[]>();
  readonly current = input.required<string>();

  protected readonly map = MAP;
  private readonly index = computed(() =>
    this.cards().findIndex((card) => card.id === this.current()),
  );
  protected readonly previous = computed(() => this.cards()[this.index() - 1]);
  protected readonly next = computed(() => this.cards()[this.index() + 1]);
}
