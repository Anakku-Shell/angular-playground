import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { CatalogApi, PRODUCTS, Product } from './catalog';
import { CATALOG_DEBOUNCE_MS } from './stores/catalog-store';
import { CartSignalStore } from './stores/cart-signal-store';
import { CartStore } from './stores/cart-store';
import { StateManagementPage } from './topic-page';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Same contract as CatalogApi, but answers synchronously: the tests only wait for debounce. */
class InstantCatalogApi {
  search(term: string, fail = false): Observable<Product[]> {
    if (fail) return throwError(() => new Error(`Search for "${term}" failed`));
    return of(PRODUCTS.filter((p) => p.name.toLowerCase().includes(term.toLowerCase())));
  }
}

describe('StateManagementPage', () => {
  let fixture: ComponentFixture<StateManagementPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CatalogApi, useClass: InstantCatalogApi }],
    });
    fixture = TestBed.createComponent(StateManagementPage);
    // ?card=all: every card on the page, as the tests below need.
    fixture.componentRef.setInput('card', 'all');
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return find(selector).textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  async function click(scope: string, label: string): Promise<void> {
    const found = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.getAttribute('aria-label') === label || b.textContent?.trim() === label,
    );
    if (!found) throw new Error(`button "${label}" not found in ${scope}`);
    found.click();
    await fixture.whenStable();
  }

  async function type(input: HTMLInputElement, value: string): Promise<void> {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(4);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(card.querySelectorAll('app-guide-box .guide__steps > li').length).toBeGreaterThan(0);
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('shares the service store between the cart and a badge', async () => {
    const demo = 'app-service-store-demo';
    expect(text(`${demo} .empty`)).toBe('The cart is empty.');

    await click(demo, 'Add Keyboard');
    await click(demo, 'Add Keyboard');
    await click(demo, 'Add Mouse');
    expect(text(`${demo} .cart-count`)).toBe('3 items');
    expect(text(`${demo} .cart-total`)).toBe('€117.00');
    expect(text('.badge-count')).toBe('3');

    await click(demo, 'Remove one Keyboard');
    expect(text(`${demo} .line-name`)).toBe('1 × Keyboard');

    await click(demo, 'Empty cart');
    expect(text('.badge-count')).toBe('0');
  });

  it('runs the same cart on SignalStore and logs each state change', async () => {
    const demo = 'app-signal-store-demo';
    await click(demo, 'Add Webcam');
    await click(demo, 'Add Monitor arm');
    expect(text(`${demo} .cart-count`)).toBe('2 items');
    expect(text(`${demo} .cart-total`)).toBe('€98.00');

    // The newest snapshot comes first.
    expect(text(`${demo} .state-log li`)).toContain('{ lines: [Webcam×1, Monitor arm×1] }');

    // Each demo has its own cart: the service-store badge did not change.
    expect(text('.badge-count')).toBe('0');
  });

  it('searches through rxMethod after the debounce and survives an error', async () => {
    await wait(CATALOG_DEBOUNCE_MS + 50);
    await fixture.whenStable();
    expect(text('.catalog-status')).toBe(`${PRODUCTS.length} products`);

    const query = find<HTMLInputElement>('.catalog-query');
    await type(query, 'm');
    await type(query, 'mo');
    await wait(CATALOG_DEBOUNCE_MS + 50);
    await fixture.whenStable();
    expect(text('.catalog-status')).toBe('4 products');
    // Two keystrokes within the debounce: one request after the initial one.
    expect(text('.catalog-requests')).toBe('2');

    const fail = find<HTMLInputElement>('.catalog-fail');
    fail.click();
    await type(query, 'key');
    await wait(CATALOG_DEBOUNCE_MS + 50);
    await fixture.whenStable();
    expect(text('.catalog-status')).toBe('Search for "key" failed');

    // The error was caught inside switchMap, so the pipeline still works.
    fail.click();
    await type(query, 'keyboard');
    await wait(CATALOG_DEBOUNCE_MS + 50);
    await fixture.whenStable();
    expect(text('.catalog-status')).toBe('1 product');
  });

  it('filters and sorts with signalState and deep signals', async () => {
    const range = find<HTMLInputElement>('.max-price-range');
    await type(range, '50');
    expect(text('.max-price')).toBe('€50.00');
    expect(text('app-signal-state-demo .visible')).not.toContain('Headphones');

    const sort = find<HTMLSelectElement>('.sort');
    sort.value = 'price';
    sort.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    const names = [...el.querySelectorAll('app-signal-state-demo .visible li')].map((li) =>
      li.firstChild?.textContent?.trim(),
    );
    expect(names).toEqual(['Mouse pad', 'Mouse', 'Monitor arm', 'Keyboard']);
    expect(text('.changes')).toBe('2');

    await click('app-signal-state-demo', 'Reset');
    expect(text('.changes')).toBe('0');
  });
});

describe('Cart stores', () => {
  const [keyboard, mouse] = PRODUCTS;

  it('CartStore: actions change the state, computed values follow', () => {
    // A root service: TestBed.inject creates it, no component needed.
    const store = TestBed.inject(CartStore);
    store.add(keyboard);
    store.add(mouse);
    store.add(keyboard);
    expect(store.count()).toBe(3);
    expect(store.total()).toBe(117);
    store.remove(keyboard.id);
    expect(store.lines()).toEqual([
      { product: keyboard, quantity: 1 },
      { product: mouse, quantity: 1 },
    ]);
  });

  it('CartSignalStore: same behavior, provided explicitly', () => {
    // No providedIn: the test provides it, like a component would.
    TestBed.configureTestingModule({ providers: [CartSignalStore] });
    const store = TestBed.inject(CartSignalStore);
    store.add(mouse);
    store.add(mouse);
    expect(store.count()).toBe(2);
    store.clear();
    expect(store.isEmpty()).toBe(true);
  });
});
