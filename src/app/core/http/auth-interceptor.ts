import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL } from './api-base-url';

/** Fake token: a real app reads it from an auth service. */
export const FAKE_TOKEN = 'demo-token';

/**
 * Adds `Authorization: Bearer …` to requests for our API only. Sending the token to every host
 * would leak it to third parties.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(inject(API_BASE_URL))) return next(req);

  // Requests are immutable: clone() returns a modified copy.
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${FAKE_TOKEN}` } }));
};
