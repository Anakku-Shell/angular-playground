import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. In this topic the exercises are tests: add them
 * to the spec files in `subjects/` and run `npx ng test --include src/app/topics/12-testing`.
 */
export const EXERCISES = {
  running: {
    files: ['subjects/'],
    tasks: [
      {
        task: 'Run only this topic: `npx ng test --watch=false --include src/app/topics/12-testing`.',
        expect: '6 test files and 32 tests pass, in a few seconds instead of the whole suite.',
        solution: `npx ng test --watch=false --include src/app/topics/12-testing`,
      },
      {
        task: "Break a test on purpose: in `greeting.spec.ts`, expect 'Good night, Ada!' at 8:00. Run it in watch mode (`npx ng test --include ...`).",
        expect:
          'The test fails with an Expected / Received diff, and re-runs by itself when you save the fix. Watch mode is the normal way to work on tests.',
        solution: `[8, 'Good morning, Ada!'],`,
      },
    ],
  },

  component: {
    files: ['subjects/star-rating.spec.ts'],
    tasks: [
      {
        task: "Write a test: setting the `label` input to 'Coffee' makes it the `aria-label` of the `[role=group]` element.",
        expect:
          'The new test passes. Accessibility attributes are part of what the user (and a screen reader) gets, so they deserve tests.',
        solution: `it('uses the label as the aria-label of the group', async () => {
  fixture.componentRef.setInput('label', 'Coffee');
  await fixture.whenStable();
  expect(el.querySelector('[role=group]')?.getAttribute('aria-label')).toBe('Coffee');
});`,
      },
      {
        task: 'Write a test: with `readonly` set, clicking a star does not emit `rated`.',
        expect:
          'It passes: a disabled button ignores `click()`, so no event reaches the component.',
        solution: `it('ignores clicks when readonly', async () => {
  fixture.componentRef.setInput('readonly', true);
  const spy = vi.fn();
  fixture.componentInstance.rated.subscribe(spy);
  await fixture.whenStable();

  stars()[0].click();
  await fixture.whenStable();

  expect(spy).not.toHaveBeenCalled();
});`,
      },
    ],
  },

  service: {
    files: ['subjects/temperature-store.spec.ts'],
    tasks: [
      {
        task: 'Write a test: `setFahrenheit(212)` gives 100 °C and feels "hot".',
        expect:
          'It passes with no TestBed setup beyond `TestBed.inject`: a store with signals is plain code.',
        solution: `it('converts boiling water', () => {
  store.setFahrenheit(212);
  expect(store.celsius()).toBe(100);
  expect(store.feel()).toBe('hot');
});`,
      },
      {
        task: 'Predict first, then try: in the effect test, delete the first `TestBed.tick()`. What does `seen` contain?',
        expect:
          '`[6]` only: the effect had not run yet when the values changed, so its first run already sees 6. Effects run when flushed, not on every write.',
        solution: `expect(seen).toEqual([6]);`,
      },
    ],
  },

  http: {
    files: ['subjects/quote-api.spec.ts'],
    tasks: [
      {
        task: 'Write a test: `page(5)` without a second argument sends `skip=0`.',
        expect: 'It passes. Testing defaults catches the day someone changes them by accident.',
        solution: `it('defaults skip to 0', async () => {
  const result = firstValueFrom(api.page(5));
  const req = httpMock.expectOne((r) => r.url === \`\${API}/quotes\`);
  expect(req.request.params.get('skip')).toBe('0');
  req.flush({ quotes: [], total: 0 });
  expect(await result).toEqual([]);
});`,
      },
      {
        task: 'Predict first, then try: add a test that only calls `api.random().subscribe()` and expects nothing.',
        expect:
          'It fails in `afterEach`: `httpMock.verify()` throws "Expected no open requests, found 1". Without that line the forgotten request would go unnoticed.',
        solution: `// Answer every request the code under test sends:
httpMock.expectOne(\`\${API}/quotes/random\`).flush(quote(1));`,
      },
    ],
  },

  mocking: {
    files: ['subjects/greeting.spec.ts'],
    tasks: [
      {
        task: 'Add the boundaries to the `it.each` table: 12:00 → "Good afternoon", 20:00 → "Good evening".',
        expect:
          'Both pass. Off-by-one bugs live at boundaries, and a fake clock makes them free to test.',
        solution: `[12, 'Good afternoon, Ada!'],
[20, 'Good evening, Ada!'],`,
      },
      {
        task: 'Replace the fake with `useClass`: write a `FakeClock` class whose `now()` returns noon, and provide `{ provide: Clock, useClass: FakeClock }`.',
        expect:
          'Same result as `useValue`. A class is handy when the fake needs state or several methods.',
        solution: `class FakeClock {
  now(): Date {
    return new Date(2026, 0, 1, 12);
  }
}

TestBed.configureTestingModule({ providers: [{ provide: Clock, useClass: FakeClock }] });`,
      },
    ],
  },

  routes: {
    files: ['subjects/user-routes.spec.ts', 'subjects/user-routes.ts'],
    tasks: [
      {
        task: 'Write a test: navigating to /3 activates `UserDetail` with `id()` "3" and shows Alan Turing.',
        expect:
          'It passes. `navigateByUrl(url, Component)` also checks which component the route activated.',
        solution: `it('shows the third user', async () => {
  const detail = await harness.navigateByUrl('/3', UserDetail);
  expect(detail.id()).toBe('3');
  expect(routeText()).toContain('Alan Turing');
});`,
      },
      {
        task: "Add `{ path: '**', redirectTo: '' }` to `userRoutes` and test that /a/b shows the list.",
        expect:
          'The test lands on `UserList`: redirects are tested exactly like normal navigations.',
        solution: `{ path: '**', redirectTo: '' },

it('redirects unknown paths to the list', async () => {
  await harness.navigateByUrl('/a/b', UserList);
  expect(routeText()).toContain('Ada Lovelace');
});`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
