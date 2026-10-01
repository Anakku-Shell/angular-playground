import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  observableVsPromise: {
    files: ['demos/observable-vs-promise-demo.ts'],
    tasks: [
      {
        task: 'Add a "Second subscriber" button that subscribes to `numbers$` again without cancelling the first subscription. Create, subscribe, then press it.',
        expect:
          '"producer starts" appears twice and the numbers arrive twice, interleaved: each subscription runs the Observable from scratch (it is cold).',
        solution: `protected subscribeAgain(): void {
  this.numbers$
    ?.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value) => this.log(\`second subscriber: next(\${value})\`));
}`,
      },
      {
        task: 'Add a button that does `const first = await firstValueFrom(this.numbers$)` and logs it.',
        expect:
          '"teardown" shows up first, then "firstValueFrom: 1": `firstValueFrom` unsubscribes as soon as the first value arrives, and the code after `await` runs a moment later. `lastValueFrom` would wait for complete.',
        solution: `// import { firstValueFrom } from 'rxjs';
protected async firstOnly(): Promise<void> {
  if (!this.numbers$) return;
  const first = await firstValueFrom(this.numbers$);
  this.log(\`firstValueFrom: \${first}\`);
}`,
      },
    ],
  },

  flattening: {
    files: ['demos/flattening-demo.ts'],
    tasks: [
      {
        task: 'Set `REQUEST_MS` to 3000 and click each button three times quickly.',
        expect:
          'The difference is easier to see: switchMap ends with 1✕ 2✕ 3✓, exhaustMap with only 1✓, concatMap with 1✓ 2✓ 3✓ one after the other.',
        solution: `export const REQUEST_MS = 3000;`,
      },
      {
        task: 'Add a fifth lane, `mergeMap(project, 2)`: mergeMap with a concurrency limit. Add a name to `OperatorName`, an entry in `OPERATORS` and a lane.',
        expect:
          'Click four times: two requests start at once, the third and fourth wait for a free slot.',
        solution: `type OperatorName = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap' | 'mergeMap2';

mergeMap2: (project) => mergeMap(project, 2),

this.lane('mergeMap2', 'at most two at a time'),`,
      },
    ],
  },

  interceptors: {
    files: ['../../core/http/interceptors.ts', '../../core/http/error-interceptor.ts'],
    tasks: [
      {
        task: 'Predict first, then try: in `APP_INTERCEPTORS`, put `loggingInterceptor` before `authInterceptor`, and send GET /products/1.',
        expect:
          'The Token column says "no": interceptors run in order, and logging now sees the request before auth adds the header. The request itself still carries it.',
        solution: `export const APP_INTERCEPTORS: HttpInterceptorFn[] = [
  authInterceptor,
  loggingInterceptor,
  errorInterceptor,
];`,
      },
      {
        task: 'Make the error interceptor ignore 404s (no global message), but still rethrow them.',
        expect:
          'GET /http/404 shows "failed with 404" under the buttons and no red banner. 503 still shows the banner.',
        solution: `if (
  error instanceof HttpErrorResponse &&
  error.status !== 404 &&
  !req.context.get(SKIP_GLOBAL_ERROR)
) {
  errors.report(error);
}`,
      },
    ],
  },

  shared: {
    files: ['demos/shared-request-demo.ts'],
    tasks: [
      {
        task: 'Add one more consumer of each stream: `protected readonly coldAgain = toSignal(this.cold$)` and the same for `shared$`.',
        expect:
          'Cold requests go to 3, shared requests stay at 1: shareReplay shares one request among every subscriber.',
        solution: `protected readonly coldAgain = toSignal(this.cold$);
protected readonly sharedAgain = toSignal(this.shared$);`,
      },
      {
        task: 'Predict first: why does `cold$` send two requests although both rows read the same field?',
        expect:
          'Because the field holds a recipe, not a result: the async pipe and toSignal each subscribe, and each subscription to an HttpClient Observable sends a request.',
        solution: `No code. The interceptor log above shows both requests.`,
      },
    ],
  },

  search: {
    files: ['demos/search-demo.ts'],
    tasks: [
      {
        task: 'Only search from 3 characters: change the `filter` so 1 and 2 characters are ignored (an empty box still resets).',
        expect: 'Typing "ph" sends nothing; "pho" searches. "Requests sent" shows it.',
        solution: `filter((term) => term.length === 0 || term.length >= 3),`,
      },
      {
        task: 'Predict first, then try: remove `distinctUntilChanged()`. Search "phone", wait for the results, then add a space at the end.',
        expect:
          '"Requests sent" goes up although the trimmed term is the same: distinctUntilChanged was what dropped the repeat.',
        solution: `distinctUntilChanged(),`,
      },
      {
        task: 'Predict first, then try: move the `catchError` out of `search()` and put it after `switchMap` in `state$`. Tick "Make requests fail", search, untick it and search again.',
        expect:
          'After the first error the box stops working for good: an error that reaches the outer stream completes it. Inside switchMap it only ends that one request.',
        solution: `// Keep catchError inside the inner Observable (in search()), before startWith.`,
      },
    ],
  },

  httpResource: {
    files: ['demos/http-resource-demo.ts'],
    tasks: [
      {
        task: 'Add an id 0 that means "nothing selected": return `undefined` from the URL function when the id is 0.',
        expect: 'Choosing 0 sends no request and `status()` says "idle".',
        solution: `protected readonly ids = [0, 1, 2, 3, 999];
protected readonly product = httpResource<Product>(() =>
  this.productId() === 0 ? undefined : this.api.productUrl(this.productId()),
);`,
      },
      {
        task: 'Transform the response with the `parse` option: upper-case the title.',
        expect:
          'Titles show in capitals. `parse` is also the place to validate the JSON (with a schema library) before it reaches the component.',
        solution: `protected readonly product = httpResource<Product>(() => this.api.productUrl(this.productId()), {
  parse: (raw) => {
    const product = raw as Product;
    return { ...product, title: product.title.toUpperCase() };
  },
});`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
