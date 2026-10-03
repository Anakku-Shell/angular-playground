import { DestroyRef, DOCUMENT, inject, InjectionToken, Signal, signal } from '@angular/core';

/**
 * [1] A token for something that is not a class: here, a signal wrapping a browser API.
 * With `providedIn: 'root'` + `factory` the token needs no provider (the factory builds the
 * default) and is tree-shakable. Tests or a subtree can still replace it with their own
 * provider, e.g. `{ provide: PREFERS_DARK_SCHEME, useValue: signal(true) }`.
 */
export const PREFERS_DARK_SCHEME = new InjectionToken<Signal<boolean>>('PREFERS_DARK_SCHEME', {
  providedIn: 'root',
  factory: () => {
    // [2] A factory runs in an injection context, so it can inject() other things.
    const query = inject(DOCUMENT).defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    const prefersDark = signal(query?.matches ?? false);

    if (query) {
      const onChange = (event: MediaQueryListEvent) => prefersDark.set(event.matches);
      query.addEventListener('change', onChange);
      // [3] In a root factory, DestroyRef belongs to the root injector (destroyed with the app).
      inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
    }

    return prefersDark.asReadonly();
  },
});
