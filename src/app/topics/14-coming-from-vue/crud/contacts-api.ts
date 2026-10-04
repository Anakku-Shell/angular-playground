import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api-base-url';
import { SKIP_GLOBAL_ERROR } from '../../../core/http/error-interceptor';
import { Contact, ContactDraft, ContactPage } from './contact';

/*
 * STEP 2 OF THE FLOW: THE SERVICE BUILDS THE REQUEST.
 *
 * Vue: the `api/contacts.ts` module you write with axios or fetch.
 *   export const getContacts = () => axios.get('/users').then((r) => r.data.users)
 * Angular: a class with `@Injectable`, and `HttpClient` instead of axios. Differences:
 *   - It returns an Observable, not a Promise: nothing is sent until someone subscribes
 *     (the store does, in contacts-store.ts).
 *   - The JSON body is parsed for you, and `get<T>()` gives it a type (a cast, not a check).
 *   - Every request goes through the app's interceptors (src/app/core/http/): the place for
 *     auth headers and global error handling, like axios interceptors.
 *
 * Read next: contacts-store.ts, which calls these methods and handles the responses.
 */

/** Fields of a DummyJSON user that the app uses (its `select` parameter). */
const FIELDS = 'firstName,lastName,email,age';

/** Contacts loaded at start. */
export const CONTACTS_LIMIT = 5;

/** Server-side delay (DummyJSON's `delay` parameter), so the loading and saving states show. */
export const CONTACTS_DELAY_MS = 600;

/**
 * Typed wrapper around DummyJSON's `/users` endpoints. DummyJSON fakes the writes: it answers as if
 * it saved the change, but nothing is stored. The next GET returns the original data.
 */
@Injectable({ providedIn: 'root' })
export class ContactsApi {
  // [1] inject() instead of `import axios`: the client comes from DI, so tests can replace it.
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /**
   * Demo only: while true, every request goes to an endpoint that answers 500, so you can see the
   * error path. A real service has nothing like this.
   */
  readonly failRequests = signal(false);

  // [2] READ: GET with query params. `map` picks the array out of the paged response.
  list(): Observable<Contact[]> {
    return this.http
      .get<ContactPage>(this.url('/users'), {
        params: { limit: CONTACTS_LIMIT, select: FIELDS, delay: CONTACTS_DELAY_MS },
        context: this.context(),
      })
      .pipe(map((page) => page.users));
  }

  // [3] CREATE: POST with a JSON body. HttpClient serialises the object and sets Content-Type.
  // The server answers the saved contact, with the id it assigned.
  create(draft: ContactDraft): Observable<Contact> {
    return this.http
      .post<Contact>(this.url('/users/add'), draft, {
        params: { delay: CONTACTS_DELAY_MS },
        context: this.context(),
      })
      .pipe(map((user) => pick(user)));
  }

  // [4] UPDATE: PUT to the item's URL, with the whole contact as the body.
  update(id: number, draft: ContactDraft): Observable<Contact> {
    return this.http
      .put<Contact>(this.url(`/users/${id}`), draft, {
        params: { delay: CONTACTS_DELAY_MS },
        context: this.context(),
      })
      .pipe(map((user) => pick(user)));
  }

  // [5] DELETE: no body. The response is the deleted user, which we do not need.
  remove(id: number): Observable<void> {
    return this.http
      .delete(this.url(`/users/${id}`), {
        params: { delay: CONTACTS_DELAY_MS },
        context: this.context(),
      })
      .pipe(map(() => undefined));
  }

  private url(path: string): string {
    return this.failRequests() ? `${this.baseUrl}/http/500` : `${this.baseUrl}${path}`;
  }

  /**
   * The store shows its own error message, so the app-wide error banner (error interceptor) is
   * skipped for these requests.
   */
  private context(): HttpContext {
    return new HttpContext().set(SKIP_GLOBAL_ERROR, true);
  }
}

/** Keeps only the fields of a `Contact`: DummyJSON answers writes with the whole user. */
function pick({ id, firstName, lastName, email, age }: Contact): Contact {
  return { id, firstName, lastName, email, age };
}
