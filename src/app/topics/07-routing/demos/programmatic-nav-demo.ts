import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ROUTING_URL } from './routing-url';

/** Buttons that navigate the mini app from code and show what the returned promise resolved to. */
@Component({
  selector: 'app-programmatic-nav-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="toProduct()">navigate(['products', 1], relativeTo)</button>
      <button type="button" (click)="sortByPrice()">navigate(['products'], queryParams)</button>
      <button type="button" (click)="toAdmin()">navigateByUrl('…/admin')</button>
      <button type="button" (click)="back()">location.back()</button>
    </div>
    <p class="result">
      Last call resolved to: <code class="nav-result">{{ result() }}</code>
    </p>
  `,
  styles: `
    .result {
      margin: 0.75rem 0 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammaticNavDemo {
  private readonly router = inject(Router);
  /** The topic page route: this component lives in its template. */
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly result = signal('–');

  protected toProduct(): void {
    this.track(this.router.navigate(['products', 1], { relativeTo: this.route }));
  }

  protected sortByPrice(): void {
    this.track(
      this.router.navigate(['products'], {
        relativeTo: this.route,
        queryParams: { sort: 'price' },
      }),
    );
  }

  protected toAdmin(): void {
    this.track(this.router.navigateByUrl(`${ROUTING_URL}/admin`));
  }

  protected back(): void {
    // Browser history, like the back button. It returns nothing: the router reacts to popstate.
    this.location.back();
    this.result.set('– (no promise)');
  }

  /**
   * true = navigated; false = a guard returned false. When a guard redirects, the promise gets the
   * result of the redirected navigation instead (true when the login page opens).
   */
  private track(navigation: Promise<boolean>): void {
    this.result.set('pending…');
    navigation.then(
      (value) => this.result.set(String(value)),
      (error: unknown) => this.result.set(`error: ${String(error)}`),
    );
  }
}
