import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  basics: {
    files: ['demos/basics-demo.ts', 'demos/basics-demo.html'],
    tasks: [
      {
        task: 'Predict first: with the total hidden, click +1 three times, then "Show total". Which run number appears?',
        expect:
          'Run #1: nothing read `total()` while it was hidden, so it never ran. A computed is lazy: it runs when read, and only if a dependency changed.',
        solution: `No code. Now click +1 with the total shown: one more run per click.`,
      },
      {
        task: 'Add a `withVat` signal and a "VAT" toggle button, and make `total` include 21 % VAT when it is on.',
        expect: 'The total changes with the toggle, and the run number goes up once per toggle.',
        solution: `// basics-demo.ts
protected readonly withVat = signal(false);
protected readonly total = computed(() => ({
  amount: this.quantity() * this.unitPrice * (this.withVat() ? 1.21 : 1),
  run: ++this.runs,
}));

<!-- basics-demo.html -->
<button type="button" (click)="withVat.update((on) => !on)">VAT</button>`,
      },
      {
        task: 'Predict first, then try: call `this.showTotal.set(true)` inside the `total` computed, and click "Show total".',
        expect:
          'Console: NG0600 "Writing to signals is not allowed in a `computed`", repeated on every render, and the page stops updating. A computed only derives; writes belong in methods or effects.',
        solution: `// Keep computed() free of writes:
protected readonly total = computed(() => ({ amount: this.quantity() * this.unitPrice, run: ++this.runs }));`,
      },
    ],
  },

  equality: {
    files: ['demos/equality-demo.ts'],
    tasks: [
      {
        task: 'Predict first, then try: replace `{ equal: samePoint }` with `{ equal: () => true }` and click "Move right".',
        expect:
          'The second row never changes: every new value counts as equal to the old one, so the signal keeps the first value and notifies no one.',
        solution: `protected readonly byValue = signal<Point>({ x: 0, y: 0 }, { equal: samePoint });`,
      },
      {
        task: 'Give `byReference` an equality too, comparing with `JSON.stringify(a) === JSON.stringify(b)`.',
        expect:
          '"Set an equal copy" no longer reruns either row. It works, but it is slower than comparing fields and depends on key order, which is why `samePoint` is the better choice.',
        solution: `protected readonly byReference = signal<Point>(
  { x: 0, y: 0 },
  { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) },
);`,
      },
    ],
  },

  untracked: {
    files: ['demos/untracked-demo.ts'],
    tasks: [
      {
        task: 'Swap it around: make `onlyA` track `b` and ignore `a` (`untracked(this.a) + this.b()`). Rename it if you like.',
        expect: 'Now "b + 1" updates that row and "a + 1" does not, until the next change of b.',
        solution: `protected readonly onlyB = computed(() => untracked(this.a) + this.b());`,
      },
      {
        task: 'Predict first, then try: change `both` to `this.a() > 3 ? this.a() + this.b() : this.a()`. Click "b + 1", then "a + 1" three times, then "b + 1" again.',
        expect:
          'The first "b + 1" does nothing (b was not read: a ≤ 3). Once a reaches 4, b is read and becomes a dependency, so the last click updates the row. Dependencies are collected on every run.',
        solution: `protected readonly both = computed(() => (this.a() > 3 ? this.a() + this.b() : this.a()));`,
      },
    ],
  },

  effect: {
    files: ['demos/effect-demo.ts'],
    tasks: [
      {
        task: 'Add a second effect that writes the character count into the browser tab title: `document.title = ...`.',
        expect:
          'The tab title follows what you type. Navigating to another topic sets a new title again.',
        solution: `// in the constructor
effect(() => {
  document.title = \`\${this.draft().length} characters · Signals\`;
});`,
      },
      {
        task: 'Predict first, then try: delete the `onCleanup(...)` line and type five characters quickly.',
        expect:
          '"Saves" goes up by 5 instead of 1: every run left its timer alive. Cleanup is how an effect cancels the work of its previous run.',
        solution: `onCleanup(() => clearTimeout(timer));`,
      },
      {
        task: 'Predict first, then try: add a `keystrokes` signal and call `this.keystrokes.update((n) => n + 1)` directly inside the effect.',
        expect:
          'It works with no error: effects may write signals (since v19). But a value derived from other signals is a computed, not an effect writing a signal.',
        solution: `// Effects can write signals, but prefer:
protected readonly characters = computed(() => this.draft().length);`,
      },
    ],
  },

  linked: {
    files: ['demos/linked-demo.ts'],
    tasks: [
      {
        task: 'Predict first, then try: use the short form `linkedSignal(() => this.methods()[0])`. Pick Express in Spain, then switch to Portugal.',
        expect:
          'The choice resets to Standard although Portugal offers Express: the short form cannot see the previous value.',
        solution: `protected readonly method = linkedSignal(() => this.methods()[0]);`,
      },
      {
        task: 'Predict first, then try: replace the linkedSignal with a plain `signal<string>(\'Standard\')`. Pick "Pickup point", then switch to Andorra.',
        expect:
          'The method stays "Pickup point", which Andorra does not offer: a plain signal never resets, so the state is now invalid.',
        solution: `protected readonly method = linkedSignal<readonly string[], string>({
  source: this.methods,
  computation: (methods, previous) =>
    previous && methods.includes(previous.value) ? previous.value : methods[0],
});`,
      },
    ],
  },

  resource: {
    files: ['demos/resource-demo.ts', 'demos/resource-demo.html'],
    tasks: [
      {
        task: 'Add a "Next" button that does `userId.update((id) => id + 1)`, and click it several times quickly.',
        expect:
          '"Requests cancelled" goes up: each new id aborts the request still in flight. After 3 you reach the error for user 4.',
        solution: `<button type="button" (click)="userId.update((id) => id + 1)">Next</button>`,
      },
      {
        task: 'Add a "Shout" button that edits the loaded value locally with `user.update(...)`.',
        expect:
          'The name turns upper case and status() becomes "local": a resource is writable, and a later reload or id change replaces the local value.',
        solution: `<button type="button" (click)="user.update((u) => u && { ...u, name: u.name.toUpperCase() })">
  Shout
</button>`,
      },
      {
        task: 'Predict first, then try: replace the `@else if (user.error()...)` and `@else if (user.hasValue())` branches with a plain `@else { {{ user.value().name }} }`.',
        expect:
          'The build fails with TS2532: `value()` may be undefined, and `hasValue()` is what narrows it. With `user.value()?.name` it compiles, but user 4 logs "ResourceValueError: Resource is currently in an error state".',
        solution: `} @else if (user.error(); as error) {
  <span class="error">{{ error.message }}</span>
} @else if (user.hasValue()) {
  {{ user.value().name }} ({{ user.value().role }})
}`,
      },
    ],
  },

  interop: {
    files: ['demos/interop-demo.ts', 'demos/interop-demo.html'],
    tasks: [
      {
        task: 'Set the debounce to 1000 ms and type a word quickly.',
        expect:
          '`query()` changes on every key; `debouncedQuery()` (and the matches) only once you stop typing for a second.',
        solution: `export const SEARCH_DEBOUNCE_MS = 1000;`,
      },
      {
        task: "Count clicks anywhere on the page with `toSignal(fromEvent(document, 'click').pipe(scan((n) => n + 1, 0)), { initialValue: 0 })` and show it.",
        expect: 'Every click on the page increases the number. Any Observable can feed a signal.',
        solution: `// interop-demo.ts (import fromEvent and scan from 'rxjs')
protected readonly pageClicks = toSignal(
  fromEvent(document, 'click').pipe(scan((n) => n + 1, 0)),
  { initialValue: 0 },
);

<!-- interop-demo.html -->
<dt>Clicks on the page</dt>
<dd>{{ pageClicks() }}</dd>`,
      },
      {
        task: "Predict first, then try: remove `{ initialValue: '' }` from `debouncedQuery`.",
        expect:
          'The build fails with TS2345 "Argument of type \'string | undefined\' is not assignable": until the first emission the signal is undefined, and `matches` does not handle that.',
        solution: `{ initialValue: '' },`,
      },
    ],
  },

  outputObservable: {
    files: ['demos/output-observable-demo.ts', 'demos/interop/hold-button.ts'],
    tasks: [
      {
        task: 'Make the button need a 2-second hold by changing only the parent template.',
        expect: 'Releasing before 2 s does nothing; the event shows `(held) → 2000`.',
        solution: `<app-hold-button duration="2000" (held)="onHeld($event)">Hold to confirm</app-hold-button>`,
      },
      {
        task: 'Add a second output, `pressing`, built with `outputFromObservable` from `press$` (true) and `release$` (false), and show "Pressing…" in the parent.',
        expect: 'The text appears while the button is held and disappears on release.',
        solution: `// hold-button.ts (import map, merge from 'rxjs')
readonly pressing = outputFromObservable(
  merge(this.press$.pipe(map(() => true)), this.release$.pipe(map(() => false))),
);

// output-observable-demo.ts
protected readonly pressing = signal(false);
<!-- template -->
<app-hold-button ... (pressing)="pressing.set($event)">...</app-hold-button>
@if (pressing()) { <p>Pressing…</p> }`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
