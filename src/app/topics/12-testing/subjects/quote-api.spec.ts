import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api-base-url';
import { Quote, QuoteApi } from './quote-api';

const API = 'http://test.local';
const quote = (id: number): Quote => ({ id, quote: `Quote ${id}`, author: `Author ${id}` });

describe('QuoteApi', () => {
  let api: QuoteApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // [1] The real HttpClient with a fake backend.
      providers: [
        // Order matters: provideHttpClient first, then the testing backend replaces the real one.
        provideHttpClient(),
        provideHttpClientTesting(),
        // Mocking a token: the service builds its URLs from whatever value is provided.
        { provide: API_BASE_URL, useValue: API },
      ],
    });
    api = TestBed.inject(QuoteApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // [4] Fails the test if a request was sent that no expectation handled.
  afterEach(() => httpMock.verify());

  it('gets a random quote', async () => {
    // [2] Subscribe first (HttpClient is lazy), then answer the pending request.
    const result = firstValueFrom(api.random());

    const req = httpMock.expectOne(`${API}/quotes/random`);
    expect(req.request.method).toBe('GET');
    req.flush(quote(7));

    expect(await result).toEqual(quote(7));
  });

  it('sends paging params and unwraps the list', async () => {
    const result = firstValueFrom(api.page(2, 10));

    // A matcher function when the URL has query params.
    const req = httpMock.expectOne((r) => r.url === `${API}/quotes`);
    expect(req.request.params.get('limit')).toBe('2');
    expect(req.request.params.get('skip')).toBe('10');
    req.flush({ quotes: [quote(11), quote(12)], total: 100 });

    expect(await result).toEqual([quote(11), quote(12)]);
  });

  // [3] Errors: flush() with an error status, or error() for a network failure.
  it('passes server errors to the caller', async () => {
    const result = firstValueFrom(api.random());

    httpMock
      .expectOne(`${API}/quotes/random`)
      .flush('Down for maintenance', { status: 503, statusText: 'Service Unavailable' });

    const error = await result.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect((error as HttpErrorResponse).status).toBe(503);
  });

  it('reports network failures with status 0', async () => {
    const result = firstValueFrom(api.random());

    httpMock.expectOne(`${API}/quotes/random`).error(new ProgressEvent('error'));

    const error = (await result.catch((e: unknown) => e)) as HttpErrorResponse;
    expect(error.status).toBe(0);
  });
});
