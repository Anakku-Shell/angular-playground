import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FakeAuth } from '../fake-auth';

/** Route `admin`, protected by `authGuard` (canActivate). */
@Component({
  selector: 'app-admin-view',
  template: `
    <h3>Admin area</h3>
    <p>Only logged-in users get here.</p>
    <button type="button" (click)="logOut()">Log out</button>
    <p class="hint">
      Logging out with the toggle above does not throw you out: guards only run on navigation.
    </p>
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminView {
  private readonly auth = inject(FakeAuth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected logOut(): void {
    this.auth.logOut();
    void this.router.navigate(['..', 'products'], { relativeTo: this.route });
  }
}
