import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  providers: {
    label: 'Providers',
    question: 'decide whether a service is shared by the whole app or per component',
    use: "`providedIn: 'root'`, `providers: [...]`",
    why: 'A component asks for a service with `inject(Counter)` and never says which instance it wants. Where the service is provided decides that: once for the whole app, or once per component that lists it in `providers`.',
    steps: [
      {
        action: 'Click "+1" on Panel A.',
        result:
          'Panel B goes up too, and both show the same Counter #: nothing on their way up provides Counter, so they get the root instance.',
      },
      {
        action: 'Click "+1" on Panel C.',
        result:
          'Only C changes. C and D each sit inside an `<app-counter-scope>` with `providers: [Counter]`, so each gets its own instance with its own number.',
      },
    ],
    snippet: `@Injectable({ providedIn: 'root' })      // one instance for the whole app
export class Counter { ... }

@Component({ providers: [Counter] })     // one instance per <app-counter-scope>
export class CounterScope {}

// any component below: the nearest provider wins
protected readonly counter = inject(Counter);`,
    read: [
      {
        file: 'demos/counters/counter.ts',
        lookFor: 'The service, provided in root. The `id` shows which instance you got.',
      },
      {
        file: 'demos/counters/counter-panel.ts',
        lookFor: 'It only calls `inject(Counter)`: it does not choose the instance.',
      },
      {
        file: 'demos/counters/counter-scope.ts',
        lookFor: '`providers: [Counter]`: a new instance for everything inside it.',
      },
      {
        file: 'demos/providers-demo.ts',
        lookFor: 'The panels, with and without a scope around them.',
      },
    ],
  },

  viewProviders: {
    label: 'viewProviders',
    question: 'hide a service from the content projected into a component',
    use: '`viewProviders: [...]`',
    why: 'A component with `providers` shares its service with its own template and with the content the parent projects into it. `viewProviders` keeps it private to its own template: projected content keeps looking further up.',
    steps: [
      {
        action: 'Compare the Counter # of the two panels in the `providers` box.',
        result: "They are the same: the projected panel also sees the box's Counter.",
      },
      {
        action: 'Compare them in the `viewProviders` box.',
        result:
          'They differ. The projected panel skipped the box and got the root Counter, the same one as Panels A and B in the previous card.',
      },
    ],
    snippet: `@Component({
  providers: [Counter],        // its view AND the projected content
  // or
  viewProviders: [Counter],    // only its own view
  template: \`<app-counter-panel />  <ng-content />\`,
})`,
    read: [
      {
        file: 'demos/counters/scope-boxes.ts',
        lookFor: 'Two boxes with the same template: [1] `providers`, [2] `viewProviders`.',
      },
      {
        file: 'demos/view-providers-demo.ts',
        lookFor: 'Each box gets a projected panel.',
      },
    ],
  },

  tokens: {
    label: 'InjectionToken',
    question: 'inject something that is not a class (config, a value, a signal)',
    use: '`new InjectionToken<T>()`',
    why: 'Classes are their own DI keys. A string, a config object or a signal has no class, so it needs a token: a named key that providers and `inject()` agree on. Angular uses tokens too, for things like the default currency.',
    steps: [
      {
        action: 'Switch your system between light and dark mode.',
        result:
          'The first row changes live. `PREFERS_DARK_SCHEME` is a token whose value is a signal built by a factory.',
      },
      {
        action: 'Compare the two prices.',
        result:
          "Same pipe, same number, different currency. `<app-euro-price>` provides Angular's own `DEFAULT_CURRENCY_CODE` token as EUR, and the pipe inside it injects that.",
      },
    ],
    snippet: `export const API_URL = new InjectionToken<string>('API_URL');

// provide it (app.config.ts, a route, a component)
providers: [{ provide: API_URL, useValue: 'https://dummyjson.com' }],

// use it
private readonly apiUrl = inject(API_URL);   // typed as string`,
    read: [
      {
        file: 'demos/tokens/prefers-dark-scheme.ts',
        lookFor: '[1] a token with a default factory, [2] the factory, [3] its cleanup.',
      },
      {
        file: 'demos/tokens/euro-price.ts',
        lookFor: 'Overriding a built-in token for one component.',
      },
      {
        file: 'demos/tokens-demo.ts',
        lookFor: 'Both used side by side.',
      },
    ],
  },

  recipes: {
    label: 'Provider recipes',
    question: 'choose how the value behind a token is built',
    use: '`useValue`, `useClass`, `useExisting`, `useFactory`',
    why: 'A provider is a recipe: "for this key, give them…". A fixed value, an instance of some class, the same thing as another key, or whatever a function returns. The consumer only knows the key, so you can swap the recipe without touching it.',
    steps: [
      {
        action: 'Click "Greet" twice.',
        result:
          'A greeting built from the `useValue` config, and a line in "Logger entries": the Greeter got the `Logger` through its `useFactory`.',
      },
      {
        action: 'Click "Write to AUDIT_LOG".',
        result:
          'The line appears in "Logger entries": `useExisting` makes AUDIT_LOG an alias of `Logger`, the same instance (see the `true` above).',
      },
      {
        action: 'Click "Write to DEBUG_LOG".',
        result:
          'It goes to its own list: `useClass` created a second, separate MemoryLogger (hence `false`).',
      },
    ],
    snippet: `providers: [
  { provide: GREETER_CONFIG, useValue: { greeting: 'Hello' } },   // this value
  { provide: Logger, useClass: MemoryLogger },                    // new MemoryLogger()
  { provide: AUDIT_LOG, useExisting: Logger },                    // same as Logger
  { provide: Greeter, useFactory: () => new Greeter(inject(GREETER_CONFIG)) },
]`,
    read: [
      {
        file: 'demos/recipes/logging.ts',
        lookFor: 'The keys: an abstract class, two tokens, and a plain class built by hand.',
      },
      {
        file: 'demos/recipes-demo.ts',
        lookFor: 'The `providers` array, one recipe per line, [1] to [5].',
      },
    ],
  },

  modifiers: {
    label: 'Modifiers',
    question: 'control where inject() looks, or allow it to find nothing',
    use: '`{ optional, self, skipSelf, host }`',
    why: '`inject()` walks up the element tree and takes the first provider it finds. Modifiers change that walk: accept a miss, look only at this element, start at the parent, or stop at the component that hosts the template.',
    steps: [
      {
        action: 'Read the first line of the demo.',
        result:
          'This component sits outside every section, so `inject(Section, { optional: true })` returns `null` instead of throwing NG0201.',
      },
      {
        action: 'Read the heads of the three sections.',
        result:
          'Inner finds Outer with `skipSelf`; Outer and Frame find nothing above them, so `null`. Without `skipSelf` a box would find itself.',
      },
      {
        action: 'Compare the two probes.',
        result:
          'Both find the nearest section with a plain `inject()`. `host: true` finds Inner for the first probe, but `null` for the one inside `<app-framed-probe>`: its search stops at that component, which provides no Section.',
      },
    ],
    snippet: `inject(Section, { optional: true })   // null instead of NG0201
inject(Section, { self: true })       // only this element
inject(Section, { skipSelf: true })   // start at the parent
inject(Section, { host: true })       // stop at the host of this template`,
    read: [
      {
        file: 'demos/sections/section.ts',
        lookFor: 'The token every box provides.',
      },
      {
        file: 'demos/sections/section-box.ts',
        lookFor: '[1] a component that provides itself, [2] `skipSelf` to find its parent.',
      },
      {
        file: 'demos/sections/section-probe.ts',
        lookFor: 'The four lookups.',
      },
      {
        file: 'demos/modifiers-demo.ts',
        lookFor: 'The tree of boxes and probes, and the lookup from outside.',
      },
    ],
  },

  destroy: {
    label: 'DestroyRef',
    question: 'clean up timers or subscriptions when something is destroyed',
    use: '`inject(DestroyRef).onDestroy()`',
    why: 'An interval, a listener or a subscription keeps running after its component is gone unless someone stops it. `DestroyRef` lets any component or service register cleanup code that runs when it is destroyed.',
    steps: [
      {
        action: 'Watch the ticker count, then click "Unmount ticker".',
        result:
          "The log shows the panel's callback and then the Ticker's, which cleared its interval. The service was destroyed with the component that provided it.",
      },
      {
        action: 'Click "Mount ticker".',
        result: 'A new Ticker with a new number starts again from 0.',
      },
    ],
    snippet: `constructor() {
  const id = setInterval(() => this.tick(), 1000);
  inject(DestroyRef).onDestroy(() => clearInterval(id));
}`,
    read: [
      {
        file: 'demos/destroy/ticker.ts',
        lookFor: '[1] the interval, [2] its cleanup.',
      },
      {
        file: 'demos/destroy/ticker-panel.ts',
        lookFor: '[1] `providers: [Ticker]`, [2] a component using `DestroyRef` too.',
      },
      {
        file: 'demos/destroy-demo.ts',
        lookFor: 'The other ways to clean up, in the header comment.',
      },
    ],
  },

  context: {
    label: 'Injection context',
    question: 'understand where inject() is allowed',
    use: 'field initializers, constructors, `runInInjectionContext()`',
    why: '`inject()` only works while Angular is creating something: in field initializers, constructors and factories. Calling it later, in a click handler or a timer, throws NG0203. This card shows the error and the two usual fixes.',
    steps: [
      {
        action: 'Click "Call it in the click handler".',
        result: 'An NG0203 error: a click happens long after the component was created.',
      },
      {
        action: 'Click "Use the one from creation".',
        result: 'It works. The usual fix: inject in a field, keep the result, use it later.',
      },
      {
        action: 'Click "Call it in runInInjectionContext".',
        result: 'It works too: the component kept its `Injector` and opens a context on demand.',
      },
    ],
    snippet: `private readonly title = injectDocumentTitle();   // ✓ field initializer

onClick() {
  injectDocumentTitle();                             // ✗ NG0203
  this.title();                                      // ✓ use what you injected
  runInInjectionContext(this.injector, () => injectDocumentTitle());   // ✓
}`,
    read: [
      {
        file: 'demos/context/inject-document-title.ts',
        lookFor: 'An "inject function": reusable DI logic with a clear error.',
      },
      {
        file: 'demos/context-demo.ts',
        lookFor:
          '[1] the call that throws, [2] the value kept from creation, [3] `runInInjectionContext`.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
