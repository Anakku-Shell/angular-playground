import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  observableVsPromise: {
    label: 'Observable vs Promise',
    question: 'understand what an Observable is, compared to a Promise',
    use: '`new Observable()`, `subscribe()`',
    why: '`HttpClient` returns Observables, not Promises. They look alike but behave differently: an Observable does nothing until someone subscribes, can emit many values, and can be cancelled. Knowing that explains most of RxJS.',
    steps: [
      {
        action: 'Click "new Promise()".',
        result:
          'The executor runs at once, and half a second later the single value arrives. Nothing can stop it.',
      },
      {
        action: 'Click "new Observable()".',
        result: '"created, nothing runs yet": an Observable is a recipe. Creating it does no work.',
      },
      {
        action: 'Click "subscribe()".',
        result: 'Now the producer starts and emits 1, 2, 3, then completes and runs its teardown.',
      },
      {
        action: 'Click "subscribe()" again, and "unsubscribe()" before it finishes.',
        result:
          'The teardown runs early and no more values come. For an HTTP request, that teardown aborts the request.',
      },
    ],
    snippet: `const numbers$ = new Observable<number>((subscriber) => {
  const id = setInterval(() => subscriber.next(Date.now()), 500);
  return () => clearInterval(id);          // teardown: on complete or unsubscribe
});                                        // nothing runs yet

const sub = numbers$.subscribe((n) => console.log(n));   // now it starts
sub.unsubscribe();                                        // and now it stops`,
    read: [
      {
        file: 'demos/observable-vs-promise-demo.ts',
        lookFor:
          '[1] the eager Promise, [2] the lazy Observable and [3] its teardown, [4] subscribing safely.',
      },
    ],
  },

  flattening: {
    label: 'Flattening operators',
    question: 'decide what happens when a new request starts before the last one finished',
    use: '`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`',
    why: 'A click or a keystroke starts a request. If the user clicks again before the answer arrives, what should happen to the first request? Each flattening operator gives a different answer, and picking the right one avoids subtle bugs.',
    steps: [
      {
        action: 'Click "switchMap" three times quickly.',
        result:
          '1▶ 1✕ 2▶ 2✕ 3▶ 3✓: each click cancels the request still running. Only the last answer counts.',
      },
      {
        action: 'Click "mergeMap" three times quickly.',
        result: 'Three ▶ and then three ✓: all run in parallel.',
      },
      {
        action: 'Click "concatMap" three times quickly.',
        result: 'They run one after the other, in order: ▶ ✓ ▶ ✓ ▶ ✓.',
      },
      {
        action: 'Click "exhaustMap" three times quickly.',
        result: 'Only the first one runs: clicks while busy are ignored.',
      },
    ],
    snippet: `search$.pipe(switchMap((term) => api.search(term)))   // latest wins: search boxes
ids$.pipe(mergeMap((id) => api.load(id)))             // all in parallel
saves$.pipe(concatMap((data) => api.save(data)))      // in order, one at a time
submit$.pipe(exhaustMap(() => api.submit()))          // ignore while busy: submit buttons`,
    read: [
      {
        file: 'demos/flattening-demo.ts',
        lookFor:
          '[1] the fake request with its ▶ ✓ ✕ log, [2] the four lanes, [3] the pipe they share.',
      },
    ],
  },

  interceptors: {
    label: 'Interceptors',
    question: 'add a header, log or handle errors for every request',
    use: '`withInterceptors([...])`',
    why: 'Some things apply to every request: an auth token, logging, a global error message. Interceptors are functions that every request goes through, so components and services do not repeat that code.',
    steps: [
      {
        action: 'Click "GET /products/1".',
        result:
          'A row appears in the log with status 200 and Token "yes": the auth interceptor added the header, the logging one recorded it.',
      },
      {
        action: 'Click "GET /http/404".',
        result:
          'The error interceptor shows a global message, and the caller still gets the error ("failed with 404").',
      },
      {
        action: 'Click "GET /http/503 (retry ×2)".',
        result:
          'Three rows in the log: `retry()` subscribes again, and every attempt goes through all the interceptors.',
      },
      {
        action: 'Click "GET another host".',
        result: 'Token "no": the auth interceptor only adds the token for our own API.',
      },
    ],
    snippet: `export const authInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { Authorization: 'Bearer …' } }));

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor]))`,
    read: [
      {
        file: '../../core/http/interceptors.ts',
        lookFor: 'The chain and its order.',
      },
      {
        file: '../../core/http/auth-interceptor.ts',
        lookFor: 'Changing the request with `clone()`.',
      },
      {
        file: '../../core/http/logging-interceptor.ts',
        lookFor: 'Looking at the response with `tap` and `finalize`.',
      },
      {
        file: '../../core/http/error-interceptor.ts',
        lookFor: 'Reporting the error and rethrowing it, and the per-request opt-out.',
      },
    ],
  },

  shared: {
    label: 'API service & sharing',
    question: 'call an API from a typed service, and avoid duplicate requests',
    use: '`HttpClient`, `async`, `toSignal()`, `shareReplay()`',
    why: 'Components should call `api.list()`, not build URLs. And because an HTTP Observable is cold, every subscriber sends its own request: reading the same stream in two places means two requests unless you share it.',
    steps: [
      {
        action: 'Look at the first "HTTP requests" counter.',
        result:
          '2: `cold$` is read with the `async` pipe and with `toSignal()`, and each one subscribed, so each one sent a request.',
      },
      {
        action: 'Look at the second counter.',
        result:
          '1: `shared$` uses `shareReplay`, so the second subscriber reused the first request.',
      },
    ],
    snippet: `// a typed service
list(limit: number): Observable<Product[]> {
  return this.http.get<ProductPage>(\`\${this.baseUrl}/products\`, { params: { limit } })
    .pipe(map((page) => page.products));
}

cold$ = this.api.list(3);                                       // one request per subscriber
shared$ = this.api.list(3).pipe(shareReplay({ bufferSize: 1, refCount: true }));`,
    read: [
      {
        file: 'products-api.ts',
        lookFor:
          'The typed service: [1] `get<T>()` gives the response its type, [2] URLs stay in one place.',
      },
      {
        file: 'demos/shared-request-demo.ts',
        lookFor: '[1] the cold stream, [2] the shared one, [3] both read twice.',
      },
    ],
  },

  search: {
    label: 'Search as you type',
    question: 'search while the user types, without flooding the server',
    use: '`debounceTime`, `distinctUntilChanged`, `switchMap`',
    why: 'Sending a request per keystroke wastes requests, and a slow old answer can overwrite a newer one. A few operators fix both: wait for a pause, skip repeats, and cancel stale requests.',
    steps: [
      {
        action: 'Type "phone" at normal speed.',
        result: '"Requests sent" goes up by 1, not 5: `debounceTime` waits until you pause.',
      },
      {
        action: 'Add a space at the end.',
        result: 'No new request: the trimmed term did not change (`distinctUntilChanged`).',
      },
      {
        action: 'Tick "Make requests fail", then change the search.',
        result:
          'An error message, and the box keeps working when you untick it and type again: the error was caught inside `switchMap`.',
      },
    ],
    snippet: `state$ = this.query.valueChanges.pipe(
  debounceTime(300),                    // wait for a pause
  distinctUntilChanged(),               // skip repeats
  switchMap((term) => this.api.search(term).pipe(
    map((page) => ({ status: 'success', page })),
    catchError(() => of({ status: 'error' })),     // inside: the stream survives
    startWith({ status: 'loading' }),
  )),
);`,
    read: [
      {
        file: 'demos/search-demo.ts',
        lookFor:
          '[1] every UI state as one type, [2] the pipe step by step, [3] the error handling, [4] `toSignal`.',
      },
    ],
  },

  httpResource: {
    label: 'httpResource',
    question: 'load data with a GET that follows a signal (experimental)',
    use: '`httpResource()`',
    why: '`httpResource()` is a `resource()` built on HttpClient: give it a URL that depends on signals, and it loads, reloads and cancels by itself, exposing everything as signals. The interceptors still run.',
    steps: [
      {
        action: 'Click product 2, then 3.',
        result: '`status()` goes `loading` → `resolved`, with `statusCode()` 200.',
      },
      {
        action: 'Click 999.',
        result: 'The API answers 404: `status()` is `error` and the message shows.',
      },
      {
        action: 'Open the Interceptors card.',
        result: 'These requests are in its log too: `httpResource` goes through HttpClient.',
      },
    ],
    snippet: `productId = signal(1);
product = httpResource<Product>(() => \`/api/products/\${this.productId()}\`);

@if (product.isLoading()) { Loading… }
@else if (product.hasValue()) { {{ product.value().title }} }`,
    read: [
      {
        file: 'demos/http-resource-demo.ts',
        lookFor: 'The variants in the header, then the resource and the template that reads it.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
