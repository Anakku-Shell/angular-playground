import { assertInInjectionContext, DOCUMENT, inject } from '@angular/core';

/**
 * An "inject function": reusable DI logic that callers use like `inject()` itself (by
 * convention its name starts with `inject`). It injects now and returns something to use
 * later, when there is no injection context any more (e.g. in a click handler).
 */
export function injectDocumentTitle(): () => string {
  // Fails early with a clear NG0203 message that names this function.
  assertInInjectionContext(injectDocumentTitle);
  const document = inject(DOCUMENT);
  return () => document.title;
}
