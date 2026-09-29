import { TestBed } from '@angular/core/testing';

import { CATALOG_LATENCY_MS, CatalogApi, Product } from './catalog';

describe('CatalogApi', () => {
  let api: CatalogApi;

  beforeEach(() => {
    // Fake timers: RxJS delay() and timer() use setTimeout, so the test moves time forward
    // instead of waiting 400 ms for real.
    vi.useFakeTimers();
    api = TestBed.inject(CatalogApi);
  });

  afterEach(() => vi.useRealTimers());

  it('answers after the fake latency, matching case-insensitively', () => {
    let result: Product[] | undefined;
    api.search('MOUSE').subscribe((products) => (result = products));

    vi.advanceTimersByTime(CATALOG_LATENCY_MS - 1);
    expect(result).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(result?.map((p) => p.name)).toEqual(['Mouse', 'Mouse pad']);
  });

  it('fails after the same latency when asked to', () => {
    let error: Error | undefined;
    api.search('key', true).subscribe({ error: (e: Error) => (error = e) });

    vi.advanceTimersByTime(CATALOG_LATENCY_MS - 1);
    expect(error).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(error?.message).toBe('Search for "key" failed');
  });
});
