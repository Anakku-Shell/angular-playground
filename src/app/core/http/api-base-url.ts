import { InjectionToken } from '@angular/core';

/**
 * Base URL of the demo REST API (DummyJSON). A token instead of a hard-coded string: tests and
 * other environments can provide a different value, and the auth interceptor uses it to decide
 * which requests get the token.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://dummyjson.com',
});
