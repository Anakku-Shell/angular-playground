import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, retry } from 'rxjs';

import { API_BASE_URL } from '../../core/http/api-base-url';
import { SKIP_GLOBAL_ERROR } from '../../core/http/error-interceptor';

/** The product fields this topic asks for (DummyJSON's `select` parameter). */
export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly category: string;
}

/** DummyJSON's paged list response. */
export interface ProductPage {
  readonly products: Product[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

const FIELDS = 'title,price,category';

/** Search results per request. */
export const SEARCH_LIMIT = 8;
/** Server-side delay added to searches (DummyJSON `delay` parameter) so loading is visible. */
export const SEARCH_DELAY_MS = 500;
/** Wait between retries of a failed request. */
export const RETRY_DELAY_MS = 300;

/**
 * Typed wrapper around the DummyJSON products API. Components call methods, not URLs, and
 * `http.get<T>()` gives the response its type.
 */
@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  // [1] get<T>() types the response. [2] The URL is built here, never in a component.
  list(limit: number): Observable<Product[]> {
    return this.http
      .get<ProductPage>(`${this.baseUrl}/products`, { params: { limit, select: FIELDS } })
      .pipe(map((page) => page.products));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(this.productUrl(id));
  }

  /** URL of one product, for `httpResource`, which takes a URL instead of an Observable. */
  productUrl(id: number): string {
    return `${this.baseUrl}/products/${id}?select=${FIELDS}`;
  }

  /**
   * Searches products by title. The caller shows its own error state, so the global error
   * handler is skipped. `fail` points to an endpoint that always fails (demo only).
   */
  search(term: string, fail = false): Observable<ProductPage> {
    const url = fail ? `${this.baseUrl}/http/500` : `${this.baseUrl}/products/search`;
    return this.http.get<ProductPage>(url, {
      params: { q: term, limit: SEARCH_LIMIT, select: FIELDS, delay: SEARCH_DELAY_MS },
      context: new HttpContext().set(SKIP_GLOBAL_ERROR, true),
    });
  }

  /** Answers with the given HTTP status (DummyJSON's `/http/:code`). */
  status(code: number): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/http/${code}`);
  }

  /**
   * A request that fails with 503, retried twice. retry() subscribes again, which sends a new
   * request through the whole interceptor chain: the log shows three attempts.
   */
  unavailable(): Observable<unknown> {
    return this.status(503).pipe(retry({ count: 2, delay: RETRY_DELAY_MS }));
  }
}
