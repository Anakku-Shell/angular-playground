import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { VaultAccessService } from './vault-access.service';

/**
 * LEGACY class-based guard: an injectable that implements `CanActivate`, listed by class in
 * `canActivate: [UnlockGuard]`. Deprecated since v15.2 (the route types call it a
 * `DeprecatedGuard`) but it still works. `mapToCanActivate([UnlockGuard])` wraps it as a
 * functional guard while you migrate.
 */
@Injectable({ providedIn: 'root' })
export class UnlockGuard implements CanActivate {
  constructor(
    private access: VaultAccessService,
    private router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.access.unlocked) return true;
    // Back to the parent URL, with a query param the topic page shows a message for.
    const parentUrl = state.url.replace(/\/vault(\?.*)?$/, '');
    return this.router.createUrlTree([parentUrl], { queryParams: { blocked: 'vault' } });
  }
}
