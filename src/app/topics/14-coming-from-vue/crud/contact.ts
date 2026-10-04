/*
 * THE MODEL. Plain TypeScript types, shared by the form, the service and the list.
 * Vue: the same interfaces you would write next to your axios calls. Nothing Angular-specific.
 */

/** A contact as the app uses it. DummyJSON calls them "users" and has many more fields. */
export interface Contact {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly age: number;
}

/** What the form produces and the API receives: a contact without its id (the back assigns it). */
export type ContactDraft = Omit<Contact, 'id'>;

/** DummyJSON's paged list response (`GET /users`). */
export interface ContactPage {
  readonly users: Contact[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}
