import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api-base-url';

export interface Quote {
  readonly id: number;
  readonly quote: string;
  readonly author: string;
}

/** DummyJSON's paged list response for quotes. */
interface QuotePage {
  readonly quotes: Quote[];
  readonly total: number;
}

/** Typed wrapper around the DummyJSON quotes API. */
@Injectable({ providedIn: 'root' })
export class QuoteApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  random(): Observable<Quote> {
    return this.http.get<Quote>(`${this.baseUrl}/quotes/random`);
  }

  /** One page of quotes; only the list is returned. */
  page(limit: number, skip = 0): Observable<Quote[]> {
    return this.http
      .get<QuotePage>(`${this.baseUrl}/quotes`, { params: { limit, skip } })
      .pipe(map((page) => page.quotes));
  }
}
