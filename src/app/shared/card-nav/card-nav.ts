import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ALL_CARDS, CardLink, MAP } from './card-view';

/**
 * Sticky tab bar of a topic page: the map, one tab per card, and "All".
 *
 * The choice lives in the URL (`?card=outputs`), not in a signal of the page, so it survives a
 * full reload: saving a `.ts` file while `ng serve` runs brings you back to the same card.
 *
 * ```html
 * <app-card-nav [cards]="view.cards" [current]="view.current()" />
 * ```
 */
@Component({
  selector: 'app-card-nav',
  imports: [RouterLink],
  templateUrl: './card-nav.html',
  styleUrl: './card-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardNav {
  readonly cards = input.required<readonly CardLink[]>();
  /** The `?card=` value: a card id, `all`, `map`, or undefined (the map too). */
  readonly current = input<string>();

  protected readonly all = ALL_CARDS;
  protected readonly map = MAP;
  /** The card shown alone, if any: the bar then offers a jump to its exercises. */
  protected readonly single = computed(() =>
    this.cards().find((card) => card.id === this.current()),
  );
  protected readonly onMap = computed(() => !this.single() && this.current() !== ALL_CARDS);
}
