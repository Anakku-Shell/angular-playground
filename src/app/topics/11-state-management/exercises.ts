import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  serviceStore: {
    files: ['stores/cart-store.ts', 'demos/service-store-demo.ts'],
    tasks: [
      {
        task: 'Persist the cart: in a constructor, read `localStorage` into `linesState`, and add an `effect()` that writes the lines back on every change.',
        expect:
          'Add products and reload the page: the cart is still there. The store is the only place that knows about storage.',
        solution: `const KEY = 'angular-playground.cart';

constructor() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) this.linesState.set(JSON.parse(saved) as CartLine[]);
  } catch {
    // storage blocked: start empty
  }
  effect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.lines()));
    } catch {
      // ignore
    }
  });
}`,
      },
      {
        task: 'Add a `freeShipping` computed (true from 3 items) and show "Free shipping" in the badge.',
        expect:
          'The badge changes at the third item. Derived state belongs in the store, next to the state it reads.',
        solution: `// cart-store.ts
readonly freeShipping = computed(() => this.count() >= 3);

<!-- CartBadge template -->
@if (cart.freeShipping()) { <span>Free shipping</span> }`,
      },
      {
        task: 'Predict first, then try: from `ServiceStoreDemo`, call `this.cart.lines.set([])`.',
        expect:
          "The build fails with TS2339 \"Property 'set' does not exist on type 'Signal<...>'\": `asReadonly()` leaves the outside only the methods to change the state.",
        solution: `this.cart.clear();   // go through the store's methods`,
      },
    ],
  },

  signalStore: {
    files: ['stores/cart-signal-store.ts', 'demos/signal-store-demo.ts'],
    tasks: [
      {
        task: 'Add `mostExpensive` to `withComputed` (the name of the priciest product in the cart, or "–") and show it under the cart.',
        expect:
          'It updates as you add and remove items. Computed values can use the state signals and each other.',
        solution: `mostExpensive: computed(() =>
  lines().reduce<CartLine | null>(
    (best, line) => (!best || line.product.price > best.product.price ? line : best),
    null,
  )?.product.name ?? '–',
),`,
      },
      {
        task: 'Add `withHooks({ onInit() {...}, onDestroy() {...} })` that logs to the console, then visit another topic.',
        expect:
          '"cart store created" when the page opens, "cart store destroyed" when you leave: the store lives as long as the component that provides it.',
        solution: `withHooks({
  onInit() {
    console.log('cart store created');
  },
  onDestroy() {
    console.log('cart store destroyed');
  },
}),`,
      },
      {
        task: 'Predict first, then try: in `SignalStoreDemo`, call `patchState(this.cart, { lines: [] })`.',
        expect:
          "The build fails with TS2345: from outside, the store's state signals are read-only (`protectedState: true` by default). Only the store's own methods can patch it.",
        solution: `this.cart.clear();`,
      },
    ],
  },

  rxMethod: {
    files: ['stores/catalog-store.ts', 'demos/rx-method-demo.ts'],
    tasks: [
      {
        task: 'Add a "Monitors" button that calls `store.setQuery(\'monitor\')`.',
        expect:
          'The input shows "monitor" and the search runs: the rxMethod listens to the query signal, whoever changes it.',
        solution: `<button type="button" (click)="store.setQuery('monitor')">Monitors</button>`,
      },
      {
        task: 'Ignore one-letter queries: add `filter((query) => query.length !== 1)` after the `map`.',
        expect: 'Typing "m" sends nothing ("Requests sent" stays); "mo" searches.',
        solution: `map((query) => query.trim()),
filter((query) => query.length !== 1),`,
      },
      {
        task: 'Predict first, then try: in `onInit`, pass the value instead of the signal: `store.search(store.query())`.',
        expect:
          'It searches once, for "", and then typing does nothing: with a plain value the rxMethod runs one time. With the signal it re-runs on every change.',
        solution: `store.search(store.query);   // the signal itself`,
      },
    ],
  },

  signalState: {
    files: ['demos/signal-state-demo.ts'],
    tasks: [
      {
        task: 'Add a `minPrice` filter (a second range input) to the nested `filters` object.',
        expect: 'Both limits apply at once, and Reset restores both.',
        solution: `filters: { minPrice: 0, maxPrice: 200, sortBy: 'name' as SortKey },

// visible
PRODUCTS.filter((p) => p.price >= minPrice && p.price <= maxPrice)

protected setMinPrice(event: Event): void {
  const minPrice = Number((event.target as HTMLInputElement).value);
  patchState(this.state, (s) => ({ filters: { ...s.filters, minPrice }, changes: s.changes + 1 }));
}`,
      },
      {
        task: 'Predict first, then try: in `setMaxPrice`, write `filters: { maxPrice }` without spreading `s.filters`.',
        expect:
          'The build fails with TS2345: patchState merges only the first level, so `filters` must be the whole object, `sortBy` included.',
        solution: `filters: { ...s.filters, maxPrice },`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
