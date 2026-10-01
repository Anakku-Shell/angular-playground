import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../../app.routes';
import { ROUTING_URL } from './demos/routing-url';

// Real timers: the product resolver waits RESOLVE_DELAY_MS on purpose.
const tick = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('RoutingPage', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
    await harness.navigateByUrl(ROUTING_URL);
  });

  function el(): HTMLElement {
    return harness.fixture.nativeElement as HTMLElement;
  }

  function text(selector: string): string {
    const found = el().querySelector(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  function productNames(): string[] {
    return [...el().querySelectorAll('.product-list a')].map((a) => a.textContent?.trim() ?? '');
  }

  function button(label: string): HTMLButtonElement {
    const found = [...el().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!found) throw new Error(`button "${label}" not found`);
    return found;
  }

  /** Lets a pending navigation (waiting on a guard) run, then renders. */
  async function settle(): Promise<void> {
    await tick();
    harness.fixture.detectChanges();
  }

  it('redirects the topic root to the product list inside the nested outlet', () => {
    expect(router.url).toBe(`${ROUTING_URL}/products`);
    expect(el().querySelectorAll('app-demo-card').length).toBe(6);
    for (const card of el().querySelectorAll('app-demo-card')) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
    expect(el().querySelector('app-mini-app app-product-list')).not.toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('Products · Routing · Angular Playground');
  });

  it('binds query params to inputs', async () => {
    expect(productNames()[0]).toBe('Headphones');
    await harness.navigateByUrl(`${ROUTING_URL}/products?sort=price`);
    expect(productNames()).toEqual(['Mouse', 'Keyboard', 'Headphones', 'Monitor']);
  });

  it('resolves the product and binds the route param, redirecting unknown ids', async () => {
    await harness.navigateByUrl(`${ROUTING_URL}/products/3`);
    expect(text('.product-name')).toBe('Monitor');
    expect(el().querySelector('app-product-detail .hint')?.textContent).toContain('3 (number)');
    expect(TestBed.inject(Title).getTitle()).toBe('Monitor · Routing · Angular Playground');

    await harness.navigateByUrl(`${ROUTING_URL}/products/99`);
    expect(router.url).toBe(`${ROUTING_URL}/products?missing=99`);
    expect(text('.missing-notice')).toContain('Product #99 does not exist');
  });

  it('sends logged-out users to login and back to where they were going', async () => {
    await harness.navigateByUrl(`${ROUTING_URL}/admin`);
    expect(router.url).toBe(`${ROUTING_URL}/login?returnUrl=%2Ftopics%2F07-routing%2Fadmin`);

    button('Log in').click();
    await harness.fixture.whenStable();
    expect(router.url).toBe(`${ROUTING_URL}/admin`);
    expect(el().querySelector('app-admin-view')).not.toBeNull();
  });

  it('asks before leaving a form with unsaved changes', async () => {
    await harness.navigateByUrl(`${ROUTING_URL}/edit`);
    const input = el().querySelector<HTMLInputElement>('.name-input');
    if (!input) throw new Error('name input not found');
    input.value = 'Grace';
    input.dispatchEvent(new Event('input'));
    harness.fixture.detectChanges();

    // Not awaited on purpose: the navigation waits for the guard's promise.
    const stay = router.navigateByUrl(`${ROUTING_URL}/products`);
    await settle();
    button('Stay').click();
    expect(await stay).toBe(false);
    expect(router.url).toBe(`${ROUTING_URL}/edit`);

    const leave = router.navigateByUrl(`${ROUTING_URL}/products`);
    await settle();
    button('Leave').click();
    expect(await leave).toBe(true);
    expect(router.url).toBe(`${ROUTING_URL}/products`);
  });

  it('follows redirect functions and catches unknown paths in the topic', async () => {
    await harness.navigateByUrl(`${ROUTING_URL}/catalog/4`);
    expect(router.url).toBe(`${ROUTING_URL}/products/4`);
    expect(text('.product-name')).toBe('Headphones');

    await harness.navigateByUrl(`${ROUTING_URL}/does-not-exist`);
    expect(text('.missing-url')).toBe(`${ROUTING_URL}/does-not-exist`);
  });

  it('navigates from code and reports the result', async () => {
    button("navigate(['products', 1], relativeTo)").click();
    await harness.fixture.whenStable();
    expect(router.url).toBe(`${ROUTING_URL}/products/1`);
    expect(text('.nav-result')).toBe('true');
  });
});
