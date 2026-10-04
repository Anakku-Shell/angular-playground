import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Contact } from './contact';

/*
 * THE CHILD: a presentational list. It gets data through an input and reports clicks through
 * outputs; it never calls the API. Vue: a component with `defineProps` and `defineEmits`.
 *
 *   Vue                                         Angular
 *   const props = defineProps<{ contacts }>()   readonly contacts = input.required<Contact[]>()
 *   const emit = defineEmits(['edit'])          readonly edit = output<Contact>()
 *   emit('edit', contact)                       this.edit.emit(contact)
 *   <ContactList @edit="startEdit" />           <app-contact-list (edit)="startEdit($event)" />
 */

/** The contacts table, with Edit and Delete buttons per row. */
@Component({
  selector: 'app-contact-list',
  template: `
    <div class="table-scroll">
      <table class="contacts">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <!-- v-for="contact in contacts" :key="contact.id"  →  @for (…; track contact.id) -->
          @for (contact of contacts(); track contact.id) {
            <tr [class.is-editing]="contact.id === editingId()">
              <td>{{ contact.firstName }} {{ contact.lastName }}</td>
              <td class="email">{{ contact.email }}</td>
              <td>{{ contact.age }}</td>
              <td class="actions">
                <!-- @click="emit('edit', contact)"  →  (click)="edit.emit(contact)" -->
                <button type="button" (click)="edit.emit(contact)" [disabled]="busy()">Edit</button>
                <button type="button" (click)="remove.emit(contact)" [disabled]="busy()">
                  Delete
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="empty">No contacts.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    // A wide table scrolls inside this box. Relative: the hidden header text below is absolutely
    // positioned, and must stay inside the box instead of widening the page.
    .table-scroll {
      position: relative;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    th,
    td {
      padding: 0.35rem 0.5rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
      white-space: nowrap;
    }

    th {
      color: var(--color-text-muted);
      font-weight: 600;
    }

    .email {
      white-space: normal;
      overflow-wrap: anywhere;
      min-width: 10rem;
    }

    .actions {
      display: flex;
      gap: 0.4rem;
      justify-content: flex-end;
    }

    .is-editing {
      background: var(--color-accent-soft);
    }

    .empty {
      color: var(--color-text-muted);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactList {
  // [1] Props. `input.required` fails the build if the parent forgets [contacts].
  readonly contacts = input.required<Contact[]>();
  readonly editingId = input<number | null>(null);
  /** Disables the buttons while a request is running. */
  readonly busy = input(false);

  // [2] Emits. The type is the payload the parent receives as `$event`.
  readonly edit = output<Contact>();
  readonly remove = output<Contact>();
}
