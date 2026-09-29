import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { FakeAuth } from '../fake-auth';
import { ROUTING_URL } from '../routing-url';

/** Route `login`. `authGuard` sends you here with `?returnUrl=` set to the page you asked for. */
@Component({
  selector: 'app-login-view',
  template: `
    <h3>Log in</h3>
    <p>
      @if (returnUrl(); as url) {
        The guard stopped you on the way to <code>{{ url }}</code
        >.
      } @else {
        Nothing is waiting for you.
      }
    </p>
    <button type="button" (click)="logIn()">Log in</button>
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginView {
  readonly returnUrl = input<string>();

  private readonly auth = inject(FakeAuth);
  private readonly router = inject(Router);

  protected logIn(): void {
    this.auth.logIn();
    // navigateByUrl only navigates inside the app, so a tampered returnUrl cannot leave the site.
    void this.router.navigateByUrl(this.returnUrl() ?? `${ROUTING_URL}/admin`);
  }
}
