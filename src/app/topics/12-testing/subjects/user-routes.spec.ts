import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { UserDetail, UserList, userRoutes } from './user-routes';

describe('user routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      // The real routes and the same router features as the app.
      providers: [provideRouter(userRoutes, withComponentInputBinding())],
    });
    // [1] The harness hosts a <router-outlet> and navigates it.
    harness = await RouterTestingHarness.create();
  });

  const routeText = () => harness.routeNativeElement?.textContent ?? '';

  it('renders the list at the root path', async () => {
    // Passing the component type checks that this route activated it.
    await harness.navigateByUrl('/', UserList);
    expect(routeText()).toContain('Grace Hopper');
  });

  it('binds the :id param to the detail input', async () => {
    // [2] navigateByUrl returns the activated component, so its inputs can be checked.
    const detail = await harness.navigateByUrl('/2', UserDetail);

    expect(detail.id()).toBe('2');
    expect(routeText()).toContain('Grace Hopper');
  });

  it('shows a message for an unknown id', async () => {
    await harness.navigateByUrl('/42', UserDetail);
    expect(routeText()).toContain('No user with id 42.');
  });

  // [3] Real clicks on real routerLinks.
  it('navigates through the links', async () => {
    const router = TestBed.inject(Router);
    await harness.navigateByUrl('/');

    harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a')?.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/1');

    harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a')?.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/');
  });
});
