import { computed, effect, linkedSignal, Signal } from '@angular/core';

import { Guide } from '../guide-box/guide';

/** One demo card of a topic page: `id` goes in the URL (`?card=id`), `label` in the tabs. */
export interface CardLink {
  readonly id: string;
  readonly label: string;
}

/** `?card=` value that shows every card on one page. */
export const ALL_CARDS = 'all';
/** `?card=` value that shows the map. No `?card` at all shows it too. */
export const MAP = 'map';

/** The tabs of a topic, in the order of its `GUIDES` object. */
export function cardLinks(guides: Readonly<Record<string, Guide>>): CardLink[] {
  return Object.entries(guides).map(([id, guide]) => ({ id, label: guide.label }));
}

/**
 * Which cards a topic page shows, from the `?card=` value. Used in a field initializer:
 *
 * ```ts
 * readonly card = input<string>();          // ?card=..., bound by withComponentInputBinding()
 * protected readonly view = cardView(GUIDES, this.card);
 * ```
 *
 * ```html
 * <app-card-nav [cards]="view.cards" [current]="view.current()" />
 * @if (view.shows('inputs')) { <app-demo-card>...</app-demo-card> }
 * ```
 */
export function cardView(
  guides: Readonly<Record<string, Guide>>,
  card: Signal<string | undefined>,
) {
  const cards = cardLinks(guides);
  /** The card shown alone, if `?card=` names one. */
  const single = computed(() => cards.find((link) => link.id === card()));
  const showAll = computed(() => card() === ALL_CARDS);
  return {
    cards,
    current: card,
    single,
    showMap: computed(() => !single()),
    shows: (id: string) => showAll() || single()?.id === id,
  };
}

/**
 * `?card=` that survives navigations which drop it, for a topic whose demo navigates (routing).
 * The last value seen is kept in sessionStorage (per browser tab) and used while the URL has none.
 * Call it in an injection context (a field initializer): it creates an effect.
 */
export function rememberedCard(
  key: string,
  card: Signal<string | undefined>,
): Signal<string | undefined> {
  const storageKey = `card:${key}`;
  // linkedSignal sees its previous value: when ?card disappears, keep the last one instead.
  // The first time (a reload) there is no previous value, so it comes from sessionStorage.
  const current = linkedSignal<string | undefined, string | undefined>({
    source: card,
    computation: (value, previous) => value ?? previous?.value ?? read(storageKey),
  });
  effect(() => {
    const value = current();
    if (value) write(storageKey, value);
  });
  return current.asReadonly();
}

// Storage can be unavailable (private mode, blocked site data): the page works without it.
function read(key: string): string | undefined {
  try {
    return sessionStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function write(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Nothing to do: the card is simply not remembered.
  }
}
