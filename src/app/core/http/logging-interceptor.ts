import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { HttpLog } from './http-log';

/** Records method, URL, status and duration of every request in `HttpLog`. */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() works here: interceptors run in an injection context. It must be called now, not
  // inside the RxJS callbacks below (they run later, outside that context).
  const log = inject(HttpLog);
  const started = performance.now();
  let status: number | undefined;

  return next(req).pipe(
    tap({
      // next() emits HttpEvents (Sent, progress, Response…); only the Response has a status.
      next: (event) => {
        if (event.type === HttpEventType.Response) status = event.status;
      },
      error: (error: unknown) => {
        status = error instanceof HttpErrorResponse ? error.status : 0;
      },
    }),
    // finalize runs on success, error and unsubscribe (e.g. switchMap cancelling the request).
    finalize(() =>
      log.add({
        method: req.method,
        url: req.urlWithParams,
        status: status ?? 'cancelled',
        ms: Math.round(performance.now() - started),
        authorized: req.headers.has('Authorization'),
      }),
    ),
  );
};
