import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files. In this topic the files to read are mostly the specs.
 */
export const GUIDES = {
  running: {
    label: 'Running tests',
    question: 'run the tests and read their output',
    use: '`npm test` (Vitest)',
    why: 'Tests check that the code still does what it should after every change. This project runs them with Vitest through `ng test`, and each `.spec.ts` file sits next to the code it tests.',
    steps: [
      {
        action: 'In a terminal, run `npm test -- --include src/app/topics/12-testing`.',
        result:
          "Vitest builds and runs only this topic's specs, then keeps watching: save a spec and it runs again.",
      },
      {
        action:
          'In `subjects/temperature-store.spec.ts`, change `toBe(86)` to `toBe(87)` and save.',
        result:
          'One test fails, and the output shows the expected and the received value side by side. Undo the change and it passes again.',
      },
      {
        action: 'Press q to stop the watcher, then run `npm run test:coverage`.',
        result:
          'One run plus a report in `coverage/`. Open its `index.html` to see which lines no test reaches.',
      },
    ],
    snippet: `describe('TemperatureStore', () => {          // a group of tests
  it('converts to Fahrenheit', () => {        // one test
    const store = TestBed.inject(TemperatureStore);
    store.setCelsius(30);
    expect(store.fahrenheit()).toBe(86);      // the check
  });
});`,
    read: [
      {
        file: 'subjects/temperature-store.spec.ts',
        lookFor: 'A short spec to start with: `describe`, `it`, `expect`.',
      },
      {
        file: '../../../../package.json',
        lookFor: 'The `test` and `test:coverage` scripts.',
      },
    ],
  },

  component: {
    label: 'Component tests',
    question: 'test a component: inputs, outputs and two-way binding',
    use: '`TestBed.createComponent()`, `setInput()`',
    why: 'A component test renders the component on a test page and drives it the way a user and a parent would: set inputs, click elements, listen to outputs, then check the DOM.',
    steps: [
      {
        action: 'Click the fourth star.',
        result:
          'The parent signal and the `rated` event both say 4, and the readonly copy follows. The spec checks exactly this.',
      },
      {
        action: 'Click "Parent sets 3".',
        result:
          'The stars change but "Last rated event" does not: `rated` only fires on user clicks. The spec "does not emit when the value is set from outside" proves it.',
      },
    ],
    snippet: `const fixture = TestBed.createComponent(StarRating);
fixture.componentRef.setInput('max', 3);            // like [max]="3"
await fixture.whenStable();

const rated: number[] = [];
fixture.componentInstance.rated.subscribe((v) => rated.push(v));
fixture.nativeElement.querySelectorAll('.star')[2].click();
await fixture.whenStable();
expect(rated).toEqual([3]);`,
    read: [
      {
        file: 'subjects/star-rating.ts',
        lookFor: 'The component under test.',
      },
      {
        file: 'subjects/star-rating.spec.ts',
        lookFor:
          '[1] creating it, [2] setting inputs, [3] listening to an output, [4] a host component for `[(value)]`.',
      },
    ],
  },

  service: {
    label: 'Service tests',
    question: 'test a service with signals',
    use: '`TestBed.inject()`',
    why: 'Logic in a service is the easiest thing to test: no DOM, only methods and signals. Computed values update at once; effects wait until `TestBed.tick()`.',
    steps: [
      {
        action: 'Type 30 in °C.',
        result: '°F shows 86 and it "Feels hot": both are `computed()` values of the store.',
      },
      {
        action: 'Type 0 in °F.',
        result: '°C shows -17.8, rounded to one decimal: the spec checks that rounding.',
      },
    ],
    snippet: `const store = TestBed.inject(TemperatureStore);   // a fresh one per test
store.setCelsius(30);
expect(store.fahrenheit()).toBe(86);              // computed: up to date at once

TestBed.runInInjectionContext(() => effect(() => seen.push(store.celsius())));
TestBed.tick();                                   // effects run here`,
    read: [
      {
        file: 'subjects/temperature-store.ts',
        lookFor: 'One writable signal and two computed values.',
      },
      {
        file: 'subjects/temperature-store.spec.ts',
        lookFor:
          '[1] a fresh store per test, [2] reading computed values right after a write, [3] effects and `TestBed.tick()`.',
      },
    ],
  },

  http: {
    label: 'HTTP tests',
    question: 'test code that calls an API, without a network',
    use: '`HttpTestingController`',
    why: 'Tests must not depend on a real server. `provideHttpClientTesting()` replaces the backend: the test sees each request, checks it, and answers with whatever data or error it needs.',
    steps: [
      {
        action: 'Click "Load a quote".',
        result:
          'A real request to DummyJSON. In the spec the same request never leaves the test: `expectOne()` catches it and `flush()` answers it.',
      },
      {
        action: 'Read the names of the four tests in the spec.',
        result:
          'Success, query params, a 503 and a network failure: cases that are hard to cause by hand take one line each.',
      },
    ],
    snippet: `providers: [provideHttpClient(), provideHttpClientTesting()],

const result = firstValueFrom(api.random());            // subscribe first
httpMock.expectOne(\`\${API}/quotes/random\`).flush(quote);  // answer the request
expect(await result).toEqual(quote);

afterEach(() => httpMock.verify());                     // no unexpected requests`,
    read: [
      {
        file: 'subjects/quote-api.ts',
        lookFor: 'The service under test.',
      },
      {
        file: 'subjects/quote-api.spec.ts',
        lookFor:
          '[1] the testing providers, [2] subscribe, expect and flush, [3] errors, [4] `verify()`.',
      },
    ],
  },

  mocking: {
    label: 'Mocking',
    question: 'replace a dependency with a fake in a test',
    use: '`{ provide, useValue }`, `vi.spyOn()`',
    why: 'Some dependencies make tests unreliable: the clock, the network, random numbers. Components get them through DI, so a test can provide a fake instead and the component never notices.',
    steps: [
      {
        action: 'Type a name.',
        result:
          'The greeting follows. Morning, afternoon or evening depends on the real clock, right now.',
      },
      {
        action: 'Open `subjects/greeting.spec.ts`.',
        result:
          'It checks all three greetings at fixed hours by providing a fake `Clock`. No waiting for the evening.',
      },
    ],
    snippet: `TestBed.configureTestingModule({
  providers: [{ provide: Clock, useValue: { now: () => new Date(2026, 0, 1, 8) } }],
});

// or keep the real service and stub one method
vi.spyOn(TestBed.inject(Clock), 'now').mockReturnValue(new Date(2026, 0, 1, 13));`,
    read: [
      {
        file: 'subjects/greeting.ts',
        lookFor: '[1] `Clock`, the dependency to replace, [2] the component that injects it.',
      },
      {
        file: 'subjects/greeting.spec.ts',
        lookFor: '[1] a fake with `useValue`, [2] a spy on the real service.',
      },
    ],
  },

  routes: {
    label: 'Route tests',
    question: 'test routes, params and links',
    use: '`RouterTestingHarness`',
    why: 'Routing glues components to URLs. `RouterTestingHarness` runs a real router inside the test, so you can check that a URL activates the right component with the right inputs.',
    steps: [
      {
        action: 'Run `subjects/user-routes.spec.ts` with the command from the first card.',
        result:
          'Four tests: the root URL shows the list, `/2` binds the param to the input, an unknown id shows a message, and clicking links navigates.',
      },
      {
        action: 'In the second test, change `/2` to `/3` and save.',
        result:
          'It fails: user 3 is Alan Turing. Breaking a test on purpose shows what each check really checks.',
      },
    ],
    snippet: `TestBed.configureTestingModule({
  providers: [provideRouter(userRoutes, withComponentInputBinding())],
});
const harness = await RouterTestingHarness.create();

const detail = await harness.navigateByUrl('/2', UserDetail);   // the component, typed
expect(detail.id()).toBe('2');`,
    read: [
      {
        file: 'subjects/user-routes.ts',
        lookFor: 'Two tiny routes, never mounted on the page.',
      },
      {
        file: 'subjects/user-routes.spec.ts',
        lookFor: '[1] the harness, [2] navigating and getting the component, [3] clicking a link.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
