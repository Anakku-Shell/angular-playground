import { HttpInterceptorFn } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { errorInterceptor } from './error-interceptor';
import { loggingInterceptor } from './logging-interceptor';

/**
 * Registered in app.config.ts: provideHttpClient(withInterceptors(APP_INTERCEPTORS)).
 * Older code writes interceptors as classes (implements HttpInterceptor) and registers them with
 * { provide: HTTP_INTERCEPTORS, useClass: ..., multi: true } plus withInterceptorsFromDi().
 *
 * The app's interceptor chain, in order. A request goes through them top to bottom before reaching
 * the server; the response comes back bottom to top. Logging sits after auth so it sees the added
 * header.
 */
export const APP_INTERCEPTORS: HttpInterceptorFn[] = [
  authInterceptor,
  loggingInterceptor,
  errorInterceptor,
];
