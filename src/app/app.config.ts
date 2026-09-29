import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { APP_INTERCEPTORS } from './core/http/interceptors';

/**
 * App-wide providers, passed to `bootstrapApplication` in `main.ts`.
 * No `provideZonelessChangeDetection()` here: zoneless is the default since v21.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Route params, query params and route data are bound to matching component inputs.
      withComponentInputBinding(),
      // Uses the browser View Transitions API to animate between pages (no-op where unsupported).
      // The first navigation (page load) is not animated: there is no previous page to fade from.
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideHttpClient(
      // The fetch API instead of XMLHttpRequest (recommended, required for SSR streaming). It does
      // not report upload progress.
      withFetch(),
      // Functional interceptors, run in array order.
      withInterceptors(APP_INTERCEPTORS),
    ),
  ],
};
