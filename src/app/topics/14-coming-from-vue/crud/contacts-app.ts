import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api-base-url';
import { HttpLog } from '../../../core/http/http-log';
import { friendlyMessage } from '../../../core/http/http-errors';
import { Contact, ContactDraft } from './contact';
import { ContactList } from './contact-list';
import { ContactsApi } from './contacts-api';

/*
 * THE PAGE: the whole CRUD flow, in the order it happens.
 *
 *   [1]-[3]  STEP 1  the form: fields, validators, error messages
 *   [4]-[5]  STEP 2  submit: validate, then ask the service for a request (contacts-api.ts)
 *   [6]-[7]  STEP 3  the response: update the list on success, show a message on error
 *   [8]      the first load (GET), and delete
 *
 * Vue: this is the `ContactsPage.vue` that owns the state (`ref`s), uses VeeValidate or hand-made
 * checks, and calls `await api.createContact(...)` in a try/catch. Here the state is signals, the
 * form is Angular's own Reactive Forms, and the request is an Observable we subscribe to.
 *
 * Read next: contacts-api.ts (how the request is built), contact-list.ts (the child).
 */

/** The contacts page: a form to create and edit, the list, and what was sent to the server. */
@Component({
  selector: 'app-contacts-app',
  imports: [ReactiveFormsModule, ContactList, JsonPipe],
  templateUrl: './contacts-app.html',
  styleUrl: './contacts-app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsApp implements OnInit {
  protected readonly api = inject(ContactsApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly httpLog = inject(HttpLog);

  // ---- State. Vue: const contacts = ref<Contact[]>([]), and so on. ----------------------------
  protected readonly contacts = signal<Contact[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  /** Id of the contact being deleted, to disable the buttons meanwhile. */
  protected readonly deletingId = signal<number | null>(null);
  /** The contact the form is editing; null means the form creates a new one. */
  protected readonly editing = signal<Contact | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  /** The body of the last POST or PUT, shown under the form. */
  protected readonly lastBody = signal<ContactDraft | null>(null);

  // Vue: const busy = computed(() => saving.value || deletingId.value !== null)
  protected readonly busy = computed(() => this.saving() || this.deletingId() !== null);

  /** The requests of this page, newest first, from the app-wide log (logging interceptor). */
  protected readonly requests = computed(() =>
    this.httpLog
      .entries()
      .filter((entry) => this.isOwnRequest(entry.url))
      .slice(0, 4),
  );

  // [1] STEP 1: THE FORM MODEL. Each field: initial value + validators. The model lives in the
  // class; the template only binds inputs to it with formControlName. Vue: a reactive({...}) for
  // the values plus your validation rules (or a VeeValidate schema), all in one object.
  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(120),
    ]),
  });

  // [8] FIRST LOAD. Vue: onMounted(load). ngOnInit runs once, after the inputs are set.
  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    // Nothing is sent until subscribe(). HTTP Observables complete after one response, so there is
    // nothing to unsubscribe from (see the tips for when you should).
    this.api.list().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  // [4] STEP 2: SUBMIT. Vue: async function onSubmit() { if (!(await validate())) return; ... }
  protected submit(): void {
    if (this.form.invalid) {
      // Show every error at once, also for fields the user never touched.
      this.form.markAllAsTouched();
      return;
    }

    const draft = this.toDraft();
    const editing = this.editing();
    this.lastBody.set(draft);
    this.saving.set(true);
    this.error.set(null);
    this.notice.set(null);

    // [5] The component does not build URLs or bodies: it asks the service for the right request.
    const request$: Observable<Contact> = editing
      ? this.api.update(editing.id, draft)
      : this.api.create(draft);

    // [6] STEP 3: THE RESPONSE. Vue: try { const saved = await ... } catch (e) { ... }
    request$.subscribe({
      next: (saved) => {
        // Success: update the list in place with what the server answered. Signals compare by
        // reference, so we set a NEW array (Vue's `contacts.value.push(x)` would not be seen).
        this.contacts.update((list) =>
          editing
            ? list.map((contact) => (contact.id === saved.id ? saved : contact))
            : [...list, withUniqueId(saved, list)],
        );
        this.notice.set(editing ? `Updated ${saved.firstName}.` : `Created ${saved.firstName}.`);
        this.saving.set(false);
        this.cancelEdit();
      },
      // [7] Error: the form keeps what the user typed, so they can try again.
      error: (error: unknown) => {
        this.error.set(errorMessage(error));
        this.saving.set(false);
      },
    });
  }

  protected startEdit(contact: Contact): void {
    this.editing.set(contact);
    this.notice.set(null);
    // patchValue fills the matching fields; the id is not a form field.
    this.form.patchValue(contact);
  }

  protected cancelEdit(): void {
    this.editing.set(null);
    // reset() also clears touched/dirty, so no error shows on the empty form.
    this.form.reset();
  }

  // [8] DELETE: same pattern, and the list drops the row only after the server says OK.
  protected remove(contact: Contact): void {
    this.deletingId.set(contact.id);
    this.error.set(null);
    this.notice.set(null);
    this.api.remove(contact.id).subscribe({
      next: () => {
        this.contacts.update((list) => list.filter((c) => c.id !== contact.id));
        if (this.editing()?.id === contact.id) this.cancelEdit();
        this.notice.set(`Deleted ${contact.firstName}.`);
        this.deletingId.set(null);
      },
      error: (error: unknown) => {
        this.error.set(errorMessage(error));
        this.deletingId.set(null);
      },
    });
  }

  protected toggleFailure(event: Event): void {
    this.api.failRequests.set((event.target as HTMLInputElement).checked);
  }

  /** The form value, typed as the API expects it. Only called when the form is valid. */
  private toDraft(): ContactDraft {
    const { firstName, lastName, email, age } = this.form.getRawValue();
    return { firstName: firstName.trim(), lastName: lastName.trim(), email, age: Number(age) };
  }

  private isOwnRequest(url: string): boolean {
    return url.startsWith(`${this.baseUrl}/users`) || url.startsWith(`${this.baseUrl}/http/500`);
  }
}

/** Turns a failed request into a message for the user. */
function errorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Unexpected error.';
  if (error.status === 404) {
    return 'Not found on the server: DummyJSON never stores new contacts, so it cannot change them.';
  }
  return friendlyMessage(error);
}

/**
 * DummyJSON does not store anything, so every new contact comes back with the same id (209). A real
 * back gives each one its own id; here we pick a free one so the list (`track contact.id`) works.
 */
function withUniqueId(saved: Contact, list: readonly Contact[]): Contact {
  if (!list.some((contact) => contact.id === saved.id)) return saved;
  return { ...saved, id: Math.max(...list.map((contact) => contact.id)) + 1 };
}
