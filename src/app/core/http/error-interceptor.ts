import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { HttpErrors } from './http-errors';

/**
 * Per-request opt-out: `http.get(url, { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) })`
 * for callers that show their own error state.
 */
export const SKIP_GLOBAL_ERROR = new HttpContextToken(() => false);

/** Global error handling: reports HTTP errors app-wide, then rethrows them to the caller. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errors = inject(HttpErrors);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !req.context.get(SKIP_GLOBAL_ERROR)) {
        errors.report(error);
      }
      // Rethrow: the caller still decides what to do (show a message, fall back, retry).
      return throwError(() => error);
    }),
  );
};
