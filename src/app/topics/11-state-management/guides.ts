import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  serviceStore: {
    label: 'Service store',
    question: 'share state across the app with plain Angular',
    use: 'a service with signals',
    why: 'Data like a shopping cart is needed in many places: the product list, the cart, a badge in the header. A store is a service that owns that state, exposes it read-only, and offers methods as the only way to change it.',
    steps: [
      {
        action: 'Add two products.',
        result:
          'The cart and the badge above update together. The badge is a separate component that only injects the store.',
      },
      {
        action: 'Remove one unit with "−", then open another topic and come back.',
        result:
          'The cart is still there: the store is provided in root, so it lives as long as the app.',
      },
    ],
    snippet: `@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly linesState = signal<CartLine[]>([]);   // only the store writes it
  readonly lines = this.linesState.asReadonly();           // everyone reads it
  readonly count = computed(() => countItems(this.lines()));

  add(product: Product) { this.linesState.update((l) => addLine(l, product)); }
}

// anywhere
protected readonly cart = inject(CartStore);   // {{ cart.count() }}`,
    read: [
      {
        file: 'stores/cart-store.ts',
        lookFor:
          'Where state can live (header), then [1] private state, [2] public reads, [3] the actions.',
      },
      {
        file: 'demos/service-store-demo.ts',
        lookFor: 'The badge and the shop, both injecting the same store.',
      },
      {
        file: 'ui/product-list.ts',
        lookFor: 'A presentational component: it knows nothing about the store.',
      },
    ],
  },

  signalStore: {
    label: 'NgRx SignalStore',
    question: 'build the same store with a standard structure',
    use: '`signalStore()` (NgRx)',
    why: 'Hand-written stores all look a bit different. NgRx SignalStore gives every store the same shape: state, computed values and methods, declared as features. Teams use it so every store reads the same way.',
    steps: [
      {
        action: 'Add a product, then another one.',
        result:
          'The cart works exactly like the previous card, and every change appears in the log, newest first.',
      },
      {
        action: 'Empty the cart, then open another topic and come back.',
        result:
          'This cart starts empty again: this store is provided by the demo component, not in root.',
      },
    ],
    snippet: `export const CartSignalStore = signalStore(
  withState({ lines: [] as CartLine[] }),                // store.lines()
  withComputed(({ lines }) => ({
    count: computed(() => countItems(lines())),          // store.count()
  })),
  withMethods((store) => ({
    add(product: Product) {
      patchState(store, (s) => ({ lines: addLine(s.lines, product) }));
    },
  })),
);`,
    read: [
      {
        file: 'stores/cart-signal-store.ts',
        lookFor: '[1] the state, [2] computed values, [3] methods with `patchState`.',
      },
      {
        file: 'demos/signal-store-demo.ts',
        lookFor: '[1] providing it in a component, [2] `watchState` for the log.',
      },
    ],
  },

  rxMethod: {
    label: 'rxMethod',
    question: 'handle async work (searches, requests) inside a store',
    use: '`rxMethod()`',
    why: 'Stores also do async work: a search that waits for the user to pause and cancels stale requests. `rxMethod` turns an RxJS pipeline into a store method, and it can follow a signal: whenever the signal changes, the pipeline runs.',
    steps: [
      {
        action: 'Type "mo" in the search box.',
        result: '"Searching…" and then the matches. "Requests sent" goes up once, after you pause.',
      },
      {
        action: 'Tick "Make requests fail", then change the search.',
        result:
          'An error message. Untick it and type again: the search still works, because the error was caught inside `switchMap`.',
      },
    ],
    snippet: `search: rxMethod<string>(
  pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => patchState(store, { status: 'loading' })),
    switchMap((query) => api.search(query).pipe(
      tap((products) => patchState(store, { products, status: 'loaded' })),
      catchError(() => { patchState(store, { status: 'error' }); return EMPTY; }),
    )),
  ),
),

withHooks({ onInit: (store) => store.search(store.query) })   // follows the signal`,
    read: [
      {
        file: 'stores/catalog-store.ts',
        lookFor:
          '[1] the state, [2] the rxMethod pipeline, [3] the error handling, [4] the hook that connects it to the query.',
      },
      {
        file: 'demos/rx-method-demo.ts',
        lookFor: 'The component only calls `setQuery()` and reads signals.',
      },
      {
        file: 'catalog.ts',
        lookFor: 'The fake API, with its delay and its failure mode.',
      },
    ],
  },

  signalState: {
    label: 'signalState',
    question: "keep a component's local state as one object",
    use: '`signalState()`, `patchState()` (NgRx)',
    why: 'When a component has several related values (filters, sort, a counter), one state object is easier to reset and to read than many signals. `signalState` gives you that object, with a signal for every field, nested ones included.',
    steps: [
      {
        action: 'Move the price slider down to 50.',
        result: 'The list keeps only the cheaper products, and "Changes" counts each update.',
      },
      {
        action: 'Sort by price, then click "Reset".',
        result: 'Everything goes back at once: one `patchState` call with the initial values.',
      },
    ],
    snippet: `state = signalState({ filters: { maxPrice: 200, sortBy: 'name' }, changes: 0 });

state.filters.maxPrice()     // a signal for every field, nested ones too

patchState(this.state, (s) => ({
  filters: { ...s.filters, maxPrice: 50 },   // merges one level deep: spread the rest
  changes: s.changes + 1,
}));`,
    read: [
      {
        file: 'demos/signal-state-demo.ts',
        lookFor:
          '[1] the state object, [2] a value derived from it, [3] updating it with `patchState`.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
