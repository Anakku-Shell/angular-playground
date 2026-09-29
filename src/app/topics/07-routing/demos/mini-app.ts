import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { FakeAuth } from './fake-auth';
import { ROUTING_URL } from './routing-url';

/**
 * A small "browser" around the topic's child routes: an address bar, a nav and the nested
 * <router-outlet>. It sits inside the topic page, and the outlet still renders the page route's
 * children: an outlet finds its parent route through the injector tree, not the template.
 */
@Component({
  selector: 'app-mini-app',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './mini-app.html',
  styleUrl: './mini-app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniApp {
  private readonly router = inject(Router);
  protected readonly auth = inject(FakeAuth);
  protected readonly baseUrl = ROUTING_URL;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Current URL without the topic prefix, e.g. "/products?sort=price". */
  protected readonly path = computed(() => this.url().slice(ROUTING_URL.length) || '/');

  /** currentNavigation (v20.2+) is a signal: not null while guards and resolvers run. */
  protected readonly navigating = computed(() => this.router.currentNavigation() !== null);

  protected go(event: SubmitEvent, path: string): void {
    event.preventDefault();
    const trimmed = path.trim();
    void this.router.navigateByUrl(`${ROUTING_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`);
  }
}
