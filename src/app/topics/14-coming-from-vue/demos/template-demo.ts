import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/*
 * TEMPLATE SYNTAX. A small shopping list that uses every common binding once. Each binding has the
 * Vue version in a comment above it. The same list in Vue is on this card (ShoppingList.vue).
 */

interface Item {
  readonly id: number;
  readonly name: string;
  readonly done: boolean;
}

/** A shopping list: two-way input, events, a list, conditionals and class bindings. */
@Component({
  selector: 'app-template-demo',
  // [1] Directives are imported per component. FormsModule brings [(ngModel)]; Vue's v-model is
  // built in. @if / @for need no import.
  imports: [FormsModule],
  template: `
    <form class="demo-row" (ngSubmit)="add()">
      <!-- [2] v-model="newItem"  →  [(ngModel)]="newItem" (works with a signal) -->
      <input name="newItem" [(ngModel)]="newItem" placeholder="Add an item" autocomplete="off" />
      <!-- [3] :disabled="!newItem.trim()"  →  [disabled]="…": [ ] binds a property -->
      <button type="submit" [disabled]="!newItem().trim()">Add</button>
    </form>

    <!-- [4] v-if / v-else  →  @if / @else -->
    @if (items().length === 0) {
      <p class="empty">The list is empty.</p>
    } @else {
      <ul class="items">
        <!-- [5] v-for="item in items" :key="item.id"  →  @for (item of items(); track item.id) -->
        @for (item of items(); track item.id) {
          <!-- [6] :class="{ done: item.done }"  →  [class.done]="item.done" -->
          <li [class.done]="item.done">
            <label>
              <!-- [7] @change="toggle(item.id)"  →  (change)="toggle(item.id)" -->
              <input type="checkbox" [checked]="item.done" (change)="toggle(item.id)" />
              {{ item.name }}
            </label>
            <button
              type="button"
              (click)="remove(item.id)"
              [attr.aria-label]="'Remove ' + item.name"
            >
              ✕
            </button>
          </li>
        }
      </ul>
    }
    <p class="summary">{{ remaining() }} of {{ items().length }} left</p>
  `,
  styles: `
    .items {
      display: grid;
      gap: 0.25rem;
      margin: 0.75rem 0 0;
      padding: 0;
      list-style: none;
      max-width: 24rem;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .done label {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .empty,
    .summary {
      margin: 0.75rem 0 0;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDemo {
  protected readonly newItem = signal('');
  protected readonly items = signal<Item[]>([
    { id: 1, name: 'Bread', done: false },
    { id: 2, name: 'Coffee', done: true },
  ]);
  protected readonly remaining = computed(() => this.items().filter((item) => !item.done).length);
  private nextId = 3;

  // [8] Update arrays by replacing them. Vue: items.value.push(...) works thanks to proxies; an
  // Angular signal only notices a NEW array (it compares with ===).
  protected add(): void {
    const name = this.newItem().trim();
    if (!name) return;
    this.items.update((items) => [...items, { id: this.nextId++, name, done: false }]);
    this.newItem.set('');
  }

  protected toggle(id: number): void {
    this.items.update((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  }

  protected remove(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}
