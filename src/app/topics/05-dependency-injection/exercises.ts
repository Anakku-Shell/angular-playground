import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  providers: {
    files: ['demos/providers-demo.ts', 'demos/counters/counter.ts'],
    tasks: [
      {
        task: 'Predict first: click +1 on Panel A a few times, open another topic, then come back. Is the count still there?',
        expect:
          'Yes: the root Counter lives as long as the app, not as long as the page. Panels C and D start again from 0, because their Counters died with their scopes.',
        solution: `No code: providedIn: 'root' = one instance for the whole app session.`,
      },
      {
        task: 'Add `providers: [Counter]` to `ProvidersDemo` itself, then repeat the visit-and-return test.',
        expect:
          'Panels A and B still share one Counter (with a new number), but the count now resets when you come back: the instance belongs to this demo component.',
        solution: `@Component({
  selector: 'app-providers-demo',
  providers: [Counter],
  ...
})`,
      },
      {
        task: 'Put a second panel, "Panel E", inside the same `<app-counter-scope>` as Panel C.',
        expect: 'C and E show the same Counter number and count together; D stays separate.',
        solution: `<app-counter-scope>
  <app-counter-panel label="Panel C" />
  <app-counter-panel label="Panel E" />
</app-counter-scope>`,
      },
    ],
  },

  viewProviders: {
    files: ['demos/view-providers-demo.ts'],
    tasks: [
      {
        task: 'Predict first: which Counter number does the "Projected" panel of the viewProviders box show? Compare it with Panel A in the card above.',
        expect:
          'The same number as Panel A: projected content does not see `viewProviders`, so it gets the root instance and counts together with Panels A and B.',
        solution: `No code. Click +1 on that panel and watch Panel A change too.`,
      },
      {
        task: 'Add a third box: an `<app-providers-box>` nested inside the first one, with its own projected panel.',
        expect:
          'The inner box gets a new Counter, and its projected panel shares it: each `providers` creates a new instance for its subtree.',
        solution: `<app-providers-box>
  <span box-title>providers: [Counter]</span>
  <app-counter-panel label="Projected" />
  <app-providers-box>
    <span box-title>nested</span>
    <app-counter-panel label="Nested projected" />
  </app-providers-box>
</app-providers-box>`,
      },
    ],
  },

  tokens: {
    files: ['demos/tokens-demo.ts'],
    tasks: [
      {
        task: 'Override the token for this demo only: `providers: [{ provide: PREFERS_DARK_SCHEME, useValue: signal(true) }]`.',
        expect:
          'The row says "dark" whatever your system theme is. This is how tests replace a browser API.',
        solution: `// tokens-demo.ts (import signal from @angular/core)
providers: [{ provide: PREFERS_DARK_SCHEME, useValue: signal(true) }],`,
      },
      {
        task: 'Provide `DEFAULT_CURRENCY_CODE` as `GBP` in `TokensDemo`.',
        expect:
          'The first price shows £9.99; the one inside `<app-euro-price>` keeps €, because the closer provider wins.',
        solution: `providers: [{ provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' }],`,
      },
      {
        task: "Create your own token with a default: `MAX_ITEMS = new InjectionToken<number>('MAX_ITEMS', { providedIn: 'root', factory: () => 10 })`, inject it and show it.",
        expect: 'It shows 10 with no provider anywhere: the factory gives the default.',
        solution: `export const MAX_ITEMS = new InjectionToken<number>('MAX_ITEMS', {
  providedIn: 'root',
  factory: () => 10,
});

protected readonly maxItems = inject(MAX_ITEMS);
<!-- template --> <dd>{{ maxItems }}</dd>`,
      },
    ],
  },

  recipes: {
    files: ['demos/recipes-demo.ts'],
    tasks: [
      {
        task: "Change the `useValue` of GREETER_CONFIG to `{ greeting: 'Hola', punctuation: '!' }`.",
        expect: '"Hola, Ada!": the Greeter never changed, only the value it receives.',
        solution: `{ provide: GREETER_CONFIG, useValue: { greeting: 'Hola', punctuation: '!' } },`,
      },
      {
        task: 'Predict first, then try: change AUDIT_LOG from `useExisting: Logger` to `useClass: MemoryLogger`.',
        expect:
          '"inject(AUDIT_LOG) === inject(Logger)" turns false, and "Write to AUDIT_LOG" no longer shows up in the Logger list: it is a separate instance now.',
        solution: `{ provide: AUDIT_LOG, useExisting: Logger },`,
      },
      {
        task: 'Predict first, then try: change DEBUG_LOG to `useExisting: Logger`.',
        expect:
          'Both lists now show the same entries, and the identity row turns true: two tokens, one instance.',
        solution: `{ provide: DEBUG_LOG, useClass: MemoryLogger },`,
      },
    ],
  },

  modifiers: {
    files: ['demos/modifiers-demo.ts', 'demos/sections/section-box.ts'],
    tasks: [
      {
        task: 'Predict first, then try: add an `<app-section-probe />` directly inside Outer, next to Inner. What do its four rows show?',
        expect:
          'inject → Outer, self → null (the probe provides nothing), skipSelf → Outer, host → Outer (the boxes are in the same template as the probe).',
        solution: `<app-section-box name="Outer">
  <app-section-probe />
  <app-section-box name="Inner">...</app-section-box>
</app-section-box>`,
      },
      {
        task: 'Predict first, then try: in `section-box.ts`, remove `skipSelf: true` from the `parent` lookup.',
        expect:
          'The topic does not open: NG0200 "Circular dependency detected for SectionBox". The box finds itself while it is still being created.',
        solution: `protected readonly parent = inject(Section, { skipSelf: true, optional: true });`,
      },
    ],
  },

  destroy: {
    files: ['demos/destroy/ticker.ts'],
    tasks: [
      {
        task: 'Log every tick (`log.add(...)` inside the interval), then delete the `clearInterval(interval)` line and unmount the ticker.',
        expect:
          'Ticks keep arriving in the log after "unmount": the component is gone but its timer is not. Put the line back and they stop.',
        solution: `const interval = setInterval(() => {
  this.elapsed.update((n) => n + 1);
  log.add(\`Ticker #\${this.id}: tick\`);
}, 1000);
// ...
inject(DestroyRef).onDestroy(() => clearInterval(interval));`,
      },
      {
        task: 'Rewrite the timer with RxJS: `interval(1000).pipe(takeUntilDestroyed()).subscribe(...)`, and drop the DestroyRef code.',
        expect:
          'Same behaviour: `takeUntilDestroyed()` uses the DestroyRef of the injection context for you.',
        solution: `// import { interval } from 'rxjs';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
interval(1000)
  .pipe(takeUntilDestroyed())
  .subscribe(() => this.elapsed.update((n) => n + 1));`,
      },
    ],
  },

  context: {
    files: ['demos/context-demo.ts', 'demos/context/inject-document-title.ts'],
    tasks: [
      {
        task: 'Predict first, then try: add a button whose handler calls `inject(DOCUMENT)` directly.',
        expect:
          'The click throws NG0203 "The `InjectionToken DocumentToken` token injection failed. `inject()` function must be called from an injection context...". The helper gives a better message because `assertInInjectionContext` names the function.',
        solution: `// The fix: inject in a field, use it later
private readonly document = inject(DOCUMENT);
protected readPath(): void {
  this.outcome.set({ ok: true, text: this.document.location.pathname });
}`,
      },
      {
        task: 'Write your own inject function, `injectPathname()`, that returns `() => location.pathname` (using `inject(DOCUMENT)`), and show its result from a button.',
        expect: 'It shows /topics/05-dependency-injection.',
        solution: `export function injectPathname(): () => string {
  assertInInjectionContext(injectPathname);
  const document = inject(DOCUMENT);
  return () => document.location.pathname;
}

// in the component
private readonly pathname = injectPathname();`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
