import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAKE_TOKEN } from '../../core/http/auth-interceptor';
import { APP_INTERCEPTORS } from '../../core/http/interceptors';
import { OTHER_HOST_URL } from './demos/interceptors-demo';
import { SEARCH_DEBOUNCE_MS } from './demos/search-demo';
import { Product } from './products-api';
import { HttpRxjsPage } from './topic-page';

const API = 'https://dummyjson.com';
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const product = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  price: 10 * id,
  category: 'test',
});

describe('HttpRxjsPage', () => {
  let fixture: ComponentFixture<HttpRxjsPage>;
  let el: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      // The real interceptor chain, with a fake backend: no request leaves the test.
      providers: [
        provideHttpClient(withInterceptors(APP_INTERCEPTORS)),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HttpRxjsPage);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    // Requests sent on load: the product list (shared-request demo) and product 1 (httpResource).
    for (const req of httpMock.match(`${API}/products?limit=3&select=title,price,category`)) {
      req.flush({ products: [product(1), product(2), product(3)], total: 3, skip: 0, limit: 3 });
    }
    httpMock.expectOne(`${API}/products/1?select=title,price,category`).flush(product(1));
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  function text(selector: string): string {
    const found = el.querySelector(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  function button(scope: string, label: string): HTMLButtonElement {
    const found = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!found) throw new Error(`button "${label}" not found in ${scope}`);
    return found;
  }

  async function click(scope: string, label: string): Promise<void> {
    button(scope, label).click();
    await fixture.whenStable();
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(6);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('shows that a Promise is eager and an Observable is lazy and cancellable', async () => {
    const demo = 'app-observable-vs-promise-demo';
    await click(demo, 'new Promise()');
    expect(text('.ovp-log')).toContain('executor runs immediately');

    await click(demo, 'new Observable()');
    expect(text('.ovp-log')).toContain('nothing runs yet');
    expect(text('.ovp-log')).not.toContain('producer starts');

    await click(demo, 'subscribe()');
    expect(text('.ovp-log')).toContain('producer starts');
    await click(demo, 'unsubscribe()');
    expect(text('.ovp-log')).toContain('teardown');
  });

  it('shows how each flattening operator handles overlapping requests', async () => {
    const lane = (name: string) => `app-flattening-demo [data-operator="${name}"]`;
    for (const name of ['switchMap', 'mergeMap', 'exhaustMap']) {
      await click(lane(name), name);
      await click(lane(name), name);
    }
    expect(text(`${lane('switchMap')} .events`)).toBe('1▶ 1✕ 2▶');
    expect(text(`${lane('mergeMap')} .events`)).toBe('1▶ 2▶');
    expect(text(`${lane('exhaustMap')} .events`)).toBe('1▶');
  });

  it('adds the token only for our API, logs requests and reports errors', async () => {
    const demo = 'app-interceptors-demo';
    await click(demo, 'GET /products/1');
    const own = httpMock.expectOne(`${API}/products/1?select=title,price,category`);
    expect(own.request.headers.get('Authorization')).toBe(`Bearer ${FAKE_TOKEN}`);
    own.flush(product(1));

    await click(demo, 'GET another host');
    const other = httpMock.expectOne(OTHER_HOST_URL);
    expect(other.request.headers.has('Authorization')).toBe(false);
    other.flush({});

    await click(demo, 'GET /http/404');
    httpMock
      .expectOne(`${API}/http/404`)
      .flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(text('.interceptor-result')).toContain('404: failed with 404');
    expect(text('.global-error')).toContain('404 · Not found.');
    // Newest first: 404, other host (no token), own API (token).
    const rows = [...el.querySelectorAll('.http-log tbody tr')].map((row) =>
      [...row.querySelectorAll('.status, .token')].map((cell) => cell.textContent?.trim()),
    );
    expect(rows.slice(0, 3)).toEqual([
      ['404', 'yes'],
      ['200', 'no'],
      ['200', 'yes'],
    ]);
  });

  it('shows the list once per consumer without shareReplay and once with it', () => {
    expect(text('.cold-requests')).toBe('2');
    expect(text('.shared-requests')).toBe('1');
    expect(text('.shared-titles')).toContain('Product 3');
  });

  it('searches after a pause and skips the global error handler', async () => {
    const input = el.querySelector<HTMLInputElement>('.search-input');
    if (!input) throw new Error('search input not found');
    input.value = 'ph';
    input.dispatchEvent(new Event('input'));
    await wait(SEARCH_DEBOUNCE_MS + 50);
    fixture.detectChanges();
    expect(text('.search-status')).toBe('Searching "ph"…');

    const req = httpMock.expectOne((r) => r.url === `${API}/products/search`);
    expect(req.request.params.get('q')).toBe('ph');
    req.flush({ products: [product(7)], total: 1, skip: 0, limit: 8 });
    await fixture.whenStable();
    expect(text('.search-status')).toBe('1 results for "ph"');
    expect(text('.search-requests')).toBe('1');

    input.value = 'pho';
    input.dispatchEvent(new Event('input'));
    await wait(SEARCH_DEBOUNCE_MS + 50);
    httpMock
      .expectOne((r) => r.url === `${API}/products/search`)
      .flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(text('.search-status')).toBe('The server failed. Try again later.');
    expect(el.querySelector('.global-error')).toBeNull();
  });

  it('loads a product with httpResource and reports a 404', async () => {
    expect(text('.resource-status')).toBe('resolved');
    expect(text('.resource-code')).toBe('200');
    expect(text('.resource-result')).toContain('Product 1');

    // Not click(): whenStable() would wait for the request, since httpResource marks the app as
    // busy until it answers. tick() runs change detection and effects, which sends it.
    button('app-http-resource-demo', '999').click();
    TestBed.tick();
    httpMock
      .expectOne(`${API}/products/999?select=title,price,category`)
      .flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    expect(text('.resource-status')).toBe('error');
    expect(text('.resource-code')).toBe('404');
  });
});
