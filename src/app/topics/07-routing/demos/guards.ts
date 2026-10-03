import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { FakeAuth } from './fake-auth';
import { ROUTING_URL } from './routing-url';

/*
 * Guard kinds:
 *   canMatch          may this route even be considered? (also stops lazy loading)
 *   canActivate       may we enter this route?
 *   canActivateChild  may we enter any child of this route?
 *   canDeactivate     may we leave this component?
 * Each returns boolean | UrlTree | RedirectCommand, or a Promise / Observable of one.
 * Older code uses classes that implement CanActivate (deprecated; see Legacy & migration).
 */

/**
 * [1] Functional guard: a plain function that runs in an injection context, so it can call inject().
 * Returning a UrlTree cancels this navigation and starts one to that URL.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(FakeAuth).loggedIn()) {
    return true;
  }
  return inject(Router).createUrlTree([ROUTING_URL, 'login'], {
    queryParams: { returnUrl: state.url },
  });
};

/** What a component must offer to be protected by `unsavedChangesGuard`. */
export interface HasUnsavedChanges {
  canLeave(): boolean | Promise<boolean>;
}

/** [2] Asks the component being left. The navigation waits while the promise is pending. */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  component.canLeave();
