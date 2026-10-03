import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  basics: {
    label: 'signal / computed',
    question: 'hold state, and derive values from it',
    use: '`signal()`, `computed()`',
    why: 'A signal is a value that tells its readers when it changes. Templates, `computed()` values and effects that read it update by themselves. That replaces "remember to refresh the view" with "change the value".',
    steps: [
      {
        action: 'Click "Show total", then "+1" twice.',
        result:
          'The total follows the quantity and its run number goes up once per change: `total` is a `computed()` that reads `quantity()`.',
      },
      {
        action: 'Click "Hide total", then "+1" a few times.',
        result:
          'Nothing reads `total()` now, so it does not run at all. A `computed()` is lazy: it only runs when someone asks for its value.',
      },
      {
        action: 'Click "Show total" again.',
        result:
          'It runs exactly once, with the latest quantity, however many clicks you made while it was hidden.',
      },
    ],
    snippet: `quantity = signal(1);
total = computed(() => this.quantity() * 12.5);   // re-runs when quantity changes

this.quantity.set(5);                 // replace the value
this.quantity.update((n) => n + 1);   // derive it from the current one

<!-- template -->
{{ quantity() }} → {{ total() }}`,
    read: [
      {
        file: 'demos/basics-demo.ts',
        lookFor:
          '[1] the signals, [2] the `computed()` that counts its runs, [3] `update()` and `set()`.',
      },
      {
        file: 'demos/basics-demo.html',
        lookFor: 'The `@if` that decides whether anything reads `total()`.',
      },
    ],
  },

  equality: {
    label: 'Equality',
    question: 'avoid updates when a new value equals the old one',
    use: '`signal(value, { equal })`',
    why: 'A signal only notifies when its value changes. By default "changes" means a different object, even if every field is the same. A custom `equal` function lets you compare by content, so equal copies cause no work.',
    steps: [
      {
        action: 'Click "Set an equal copy" a few times.',
        result:
          'The default row keeps the same text but its run number goes up: a new object is a change for `Object.is`. The `equal: samePoint` row does not move.',
      },
      {
        action: 'Click "Move right".',
        result: 'Both rows run: the value really changed.',
      },
    ],
    snippet: `const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

byReference = signal({ x: 0, y: 0 });                        // Object.is
byValue = signal({ x: 0, y: 0 }, { equal: samePoint });      // compares fields

this.byValue.set({ x: 0, y: 0 });   // equal: ignored, nobody is notified`,
    read: [
      {
        file: 'demos/equality-demo.ts',
        lookFor:
          '[1] the default signal, [2] the one with `equal`, [3] the copy that only one of them ignores.',
      },
    ],
  },

  untracked: {
    label: 'untracked',
    question: 'read a signal without reacting to it',
    use: '`untracked()`',
    why: 'Every signal read inside a `computed()` becomes a dependency. Sometimes you need the current value of a signal without re-running when it changes. `untracked()` reads it without subscribing.',
    steps: [
      {
        action: 'Click "b + 1" twice.',
        result:
          '`a() + b()` updates, `a() + untracked(b)` does not: b is not one of its dependencies.',
      },
      {
        action: 'Click "a + 1".',
        result:
          'Now both rows agree again. The untracked computed re-ran because of `a`, and read the latest `b` while running.',
      },
    ],
    snippet: `both  = computed(() => this.a() + this.b());             // depends on a and b
onlyA = computed(() => this.a() + untracked(this.b));    // depends on a only`,
    read: [
      {
        file: 'demos/untracked-demo.ts',
        lookFor: '[1] a normal computed, [2] the one with `untracked`.',
      },
      {
        file: 'demos/untracked-demo.html',
        lookFor: 'The header comment: dependencies are collected again on every run.',
      },
    ],
  },

  effect: {
    label: 'effect',
    question: 'do something outside Angular when a signal changes',
    use: '`effect()`',
    why: 'Some reactions are not values: saving to localStorage, logging, talking to a library that knows nothing about Angular. `effect()` runs code whenever the signals it reads change.',
    steps: [
      {
        action: 'Type a sentence in the textarea.',
        result:
          '"Saves" goes up once, half a second after you stop. Each keystroke re-ran the effect, and its cleanup cancelled the save still pending.',
      },
      {
        action: 'Reload the page (F5) and come back to this card.',
        result:
          'Your text is still there: the effect wrote it to localStorage, and the signal starts from it.',
      },
      {
        action: 'Click "Clear".',
        result: 'The draft is emptied, and the effect saves the empty text too.',
      },
    ],
    snippet: `constructor() {
  effect((onCleanup) => {
    const text = this.draft();                    // the dependency
    const timer = setTimeout(() => save(text), 500);
    onCleanup(() => clearTimeout(timer));         // before the next run
  });
}`,
    read: [
      {
        file: 'demos/effect-demo.ts',
        lookFor:
          '[1] where an effect can be created, [2] its dependency, [3] the cleanup, [4] the save.',
      },
      {
        file: 'demos/effect-demo.html',
        lookFor: 'The table that tells `computed`, `linkedSignal` and `effect` apart.',
      },
    ],
  },

  linked: {
    label: 'linkedSignal',
    question: 'keep a choice that resets only when it stops making sense',
    use: '`linkedSignal({ source, computation })`',
    why: 'A shipping method depends on the country, but the user picks it. When the country changes, the old choice should stay if the new country still offers it, and reset otherwise. `linkedSignal` is a writable signal that is recomputed when its source changes, with access to the previous value.',
    steps: [
      {
        action: 'Pick "Express", then change the country to Portugal.',
        result:
          '`method()` stays "Express": Portugal offers it, so the computation kept the previous value.',
      },
      {
        action: 'Change the country to Andorra.',
        result: 'It falls back to "Standard", the only option there.',
      },
      {
        action: 'Go back to Spain.',
        result: 'It stays "Standard": that was the previous value, and Spain offers it.',
      },
    ],
    snippet: `method = linkedSignal({
  source: this.methods,                         // recompute when this changes
  computation: (methods, previous) =>
    previous && methods.includes(previous.value) ? previous.value : methods[0],
});

this.method.set('Express');   // and the user can still write it`,
    read: [
      {
        file: 'demos/linked-demo.ts',
        lookFor: '[1] the source, a `computed()`, [2] the `linkedSignal` with its computation.',
      },
      {
        file: 'demos/linked-demo.html',
        lookFor: 'The two forms of `linkedSignal`, in the header comment.',
      },
    ],
  },

  resource: {
    label: 'resource',
    question: 'load async data that depends on a signal',
    use: '`resource()`',
    why: 'Loading data has several states: loading, loaded, failed, and stale requests to cancel when the input changes. `resource()` turns all of that into signals the template can read.',
    steps: [
      {
        action: 'Click user 2.',
        result: '`status()` goes through `loading` to `resolved`, and the name appears.',
      },
      {
        action: 'Click 3 and then 1 quickly, before the first answer arrives.',
        result:
          '"Requests cancelled" goes up: when `params` changed, the resource aborted the request still running.',
      },
      {
        action: 'Click 4.',
        result: 'The loader rejects, `status()` is `error` and the message shows.',
      },
      {
        action: 'Click 1, wait, then "Reload".',
        result: '`status()` is `reloading`: it keeps the old value while fetching it again.',
      },
    ],
    snippet: `userId = signal(1);

user = resource({
  params: () => this.userId(),                               // reactive
  loader: ({ params, abortSignal }) => fetchUser(params, abortSignal),
});

<!-- template -->
@if (user.isLoading()) { Loading… }
@else if (user.hasValue()) { {{ user.value().name }} }`,
    read: [
      {
        file: 'demos/resource-demo.ts',
        lookFor: '[1] the fake API, [2] where it notices the abort, [3] the resource.',
      },
      {
        file: 'demos/resource-demo.html',
        lookFor: 'The order of the checks: loading, then error, then value.',
      },
    ],
  },

  interop: {
    label: 'RxJS interop',
    question: 'use RxJS operators with signals',
    use: '`toSignal()`, `toObservable()`',
    why: 'Signals hold state; RxJS is good at time: debouncing, retries, combining streams. The interop functions convert between them, so each one does what it is best at.',
    steps: [
      {
        action: 'Type "link" quickly in the search box.',
        result:
          '`query()` changes on every key, `debouncedQuery()` only 300 ms after you stop: the signal went through `debounceTime` as an Observable and came back.',
      },
      {
        action: 'Look at "Seconds on this page".',
        result:
          'An RxJS `interval` turned into a signal with `toSignal()`. It unsubscribes when you leave the card.',
      },
    ],
    snippet: `query = signal('');

debounced = toSignal(
  toObservable(this.query).pipe(debounceTime(300), distinctUntilChanged()),
  { initialValue: '' },
);

matches = computed(() => NAMES.filter((n) => n.includes(this.debounced())));`,
    read: [
      {
        file: 'demos/interop-demo.ts',
        lookFor:
          '[1] signal → Observable → signal, [2] a value derived from it, [3] any Observable as a signal.',
      },
    ],
  },

  outputObservable: {
    label: 'Output from RxJS',
    question: 'turn an Observable into a component output',
    use: '`outputFromObservable()`',
    why: 'Some events are easier to describe with RxJS: "pressed and held for 800 ms, unless released before". `outputFromObservable()` exposes such a stream as a normal output, so the parent just writes `(held)="..."`.',
    steps: [
      {
        action: 'Press and hold "Hold to confirm" for about a second.',
        result: '"Confirmations" goes up and the event shows 800, the payload the stream emitted.',
      },
      {
        action: 'Press it and release quickly.',
        result: 'Nothing: the release cancelled the timer (`takeUntil`).',
      },
      {
        action: 'Focus the button with Tab and hold the Space bar.',
        result: 'It works with the keyboard too: the stream merges pointer and key events.',
      },
    ],
    snippet: `// child
readonly held = outputFromObservable(
  press$.pipe(switchMap(() => timer(800).pipe(takeUntil(release$)))),
);

<!-- parent: a normal output -->
<app-hold-button (held)="onHeld($event)">Hold to confirm</app-hold-button>`,
    read: [
      {
        file: 'demos/interop/hold-button.ts',
        lookFor: '[1] the press and release streams, [2] the output built from them.',
      },
      {
        file: 'demos/output-observable-demo.ts',
        lookFor: 'The parent: it listens to `(held)` like any other output.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
