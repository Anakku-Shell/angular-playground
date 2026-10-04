import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_INTERCEPTORS } from '../../core/http/interceptors';
import { Contact } from './crud/contact';
import { CONTACTS_DELAY_MS, CONTACTS_LIMIT } from './crud/contacts-api';
import { FavoritesStore } from './demos/favorites-store';
import { ComingFromVuePage } from './topic-page';

const API = 'https://dummyjson.com';
const LIST_URL = `${API}/users?limit=${CONTACTS_LIMIT}&select=firstName,lastName,email,age&delay=${CONTACTS_DELAY_MS}`;

const contact = (id: number, firstName: string): Contact => ({
  id,
  firstName,
  lastName: 'Test',
  email: `${firstName.toLowerCase()}@test.dev`,
  age: 30,
});

describe('ComingFromVuePage', () => {
  let fixture: ComponentFixture<ComingFromVuePage>;
  let el: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    sessionStorage.removeItem('vue-counter');
    TestBed.configureTestingModule({
      // The real interceptor chain, with a fake backend: no request leaves the test.
      providers: [
        provideHttpClient(withInterceptors(APP_INTERCEPTORS)),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ComingFromVuePage);
    // ?card=all: every card on the page, as the tests below need.
    fixture.componentRef.setInput('card', 'all');
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    // The contacts app loads its list on start.
    httpMock
      .expectOne(LIST_URL)
      .flush({ users: [contact(1, 'Emily'), contact(2, 'Michael')], total: 2, skip: 0, limit: 5 });
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.inject(FavoritesStore).clear();
    sessionStorage.removeItem('vue-counter');
  });

  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return find(selector).textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  function button(scope: string, label: string): HTMLButtonElement {
    const found = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) =>
        b.getAttribute('aria-label') === label ||
        b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!found) throw new Error(`button "${label}" not found in ${scope}`);
    return found;
  }

  async function click(scope: string, label: string): Promise<void> {
    button(scope, label).click();
    await fixture.whenStable();
  }

  async function type(selector: string, value: string): Promise<void> {
    const input = find<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  async function fillContact(firstName: string, age: string): Promise<void> {
    const form = 'app-contacts-app form';
    await type(`${form} [formControlName="firstName"]`, firstName);
    await type(`${form} [formControlName="lastName"]`, 'Lovelace');
    await type(`${form} [formControlName="email"]`, 'ada@test.dev');
    await type(`${form} [formControlName="age"]`, age);
  }

  it('renders one demo card per concept, each with a guide, a comparison and exercises', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(7);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(card.querySelectorAll('app-guide-box .guide__steps > li').length).toBeGreaterThan(0);
      expect(card.querySelectorAll('app-vue-compare tbody tr').length).toBeGreaterThan(0);
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
    // The contacts app is shared by the three CRUD cards: rendered once.
    expect(el.querySelectorAll('app-contacts-app').length).toBe(1);
  });

  it('counts with a signal, derives with computed and saves with an effect', async () => {
    await click('app-counter-demo', '+');
    await click('app-counter-demo', '+');
    await click('app-counter-demo', '+');
    expect(text('app-counter-demo .count')).toBe('3');
    expect(text('app-counter-demo .double')).toBe('6');
    expect(text('app-counter-demo .parity')).toBe('odd');
    expect(sessionStorage.getItem('vue-counter')).toBe('3');
  });

  it('adds, ticks and removes items in the template demo', async () => {
    const demo = 'app-template-demo';
    await type(`${demo} input[name="newItem"]`, 'Milk');
    find<HTMLFormElement>(`${demo} form`).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(text(`${demo} .items`)).toContain('Milk');
    expect(text(`${demo} .summary`)).toBe('2 of 3 left');

    for (const item of ['Bread', 'Coffee', 'Milk']) await click(demo, `Remove ${item}`);
    expect(text(`${demo} .empty`)).toBe('The list is empty.');
  });

  it('binds a child with model, input, output and projected content', async () => {
    const adults = 'app-parent-child-demo app-quantity-stepper:first-of-type';
    expect(text(adults)).toContain('Adults');
    await click(adults, 'More');
    expect(text('app-parent-child-demo .adults')).toBe('3');
    expect(text('app-parent-child-demo .total')).toBe('3');

    await click(adults, 'More');
    await click(adults, 'More');
    expect(text('app-parent-child-demo .adults')).toBe('4');
    expect(text('app-parent-child-demo .limit-message')).toBe('At most 4 adults.');
  });

  it('shares one root store between two components', async () => {
    await click('app-favorite-picker', '☆ Vue');
    await click('app-favorite-picker', '☆ Angular');
    expect(text('app-favorite-badge .favorite-count')).toBe('2');
    expect(text('app-favorite-badge .favorite-list')).toBe('Vue, Angular');
  });

  it('shows every error and sends nothing when an invalid form is submitted', async () => {
    expect(el.querySelectorAll('app-contact-list tbody tr').length).toBe(2);
    await click('app-contacts-app form', 'Create');
    expect(el.querySelectorAll('app-contacts-app .field-error').length).toBe(4);
    expect(text('app-contacts-app .form-status')).toBe('INVALID');
    httpMock.expectNone(`${API}/users/add?delay=${CONTACTS_DELAY_MS}`);
  });

  it('creates a contact: POSTs the draft and adds the answer to the list', async () => {
    await fillContact('Ada', '36');
    expect(text('app-contacts-app .form-status')).toBe('VALID');
    await click('app-contacts-app form', 'Create');

    const req = httpMock.expectOne(`${API}/users/add?delay=${CONTACTS_DELAY_MS}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@test.dev',
      age: 36,
    });
    expect(text('app-contacts-app button[type="submit"]')).toBe('Saving…');

    req.flush({ ...req.request.body, id: 209, phone: 'ignored' });
    await fixture.whenStable();
    expect(text('app-contacts-app .crud-notice')).toBe('Created Ada.');
    expect(el.querySelectorAll('app-contact-list tbody tr').length).toBe(3);
    expect(text('app-contact-list tbody')).toContain('Ada Lovelace');
    expect(find<HTMLInputElement>('[formControlName="firstName"]').value).toBe('');
    expect(text('app-contacts-app .requests')).toContain('POST');
  });

  it('updates a contact with PUT and deletes one with DELETE', async () => {
    await click('app-contact-list tbody tr:first-child', 'Edit');
    expect(text('app-contacts-app .form-title')).toBe('Edit Emily');
    await type('[formControlName="age"]', '41');
    await click('app-contacts-app form', 'Save changes');

    const put = httpMock.expectOne(`${API}/users/1?delay=${CONTACTS_DELAY_MS}`);
    expect(put.request.method).toBe('PUT');
    expect(put.request.body.age).toBe(41);
    put.flush({ ...contact(1, 'Emily'), age: 41, gender: 'female' });
    await fixture.whenStable();
    expect(text('app-contact-list tbody tr:first-child')).toContain('41');

    await click('app-contact-list tbody tr:last-child', 'Delete');
    const del = httpMock.expectOne(`${API}/users/2?delay=${CONTACTS_DELAY_MS}`);
    expect(del.request.method).toBe('DELETE');
    del.flush(contact(2, 'Michael'));
    await fixture.whenStable();
    expect(el.querySelectorAll('app-contact-list tbody tr').length).toBe(1);
    expect(text('app-contacts-app .crud-notice')).toBe('Deleted Michael.');
  });

  it('shows an error and keeps the form when the server fails', async () => {
    find<HTMLInputElement>('.fail-toggle').click();
    await fillContact('Ada', '36');
    await click('app-contacts-app form', 'Create');

    httpMock
      .expectOne(`${API}/http/500?delay=${CONTACTS_DELAY_MS}`)
      .flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(text('app-contacts-app .crud-error')).toBe('The server failed. Try again later.');
    expect(find<HTMLInputElement>('[formControlName="firstName"]').value).toBe('Ada');
    expect(el.querySelectorAll('app-contact-list tbody tr').length).toBe(2);
    // The page shows its own message: the app-wide banner is skipped.
    expect(el.querySelector('.global-error')).toBeNull();
  });
});
