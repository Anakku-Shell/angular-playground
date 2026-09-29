import { Injectable, signal } from '@angular/core';

/**
 * Fake login state for the guard demo. Provided in the topic's route (`providers` in
 * `07-routing.routes.ts`), so the page, the views and the guards share one instance.
 */
@Injectable()
export class FakeAuth {
  private readonly loggedInState = signal(false);
  readonly loggedIn = this.loggedInState.asReadonly();

  logIn(): void {
    this.loggedInState.set(true);
  }

  logOut(): void {
    this.loggedInState.set(false);
  }

  toggle(): void {
    this.loggedInState.update((loggedIn) => !loggedIn);
  }
}
