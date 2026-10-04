import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FavoritesStore } from './favorites-store';

/*
 * TWO COMPONENTS, ONE STORE. Neither knows the other: they only inject the same service, so a
 * change in one shows up in the other. No props, no emits, no event bus.
 */

const FRAMEWORKS = ['Angular', 'Vue', 'React', 'Svelte', 'Solid'];

/** A list of toggle buttons that writes to the store. */
@Component({
  selector: 'app-favorite-picker',
  template: `
    <div class="demo-row">
      @for (name of frameworks; track name) {
        <button type="button" [attr.aria-pressed]="store.has(name)" (click)="store.toggle(name)">
          {{ store.has(name) ? '★' : '☆' }} {{ name }}
        </button>
      }
    </div>
  `,
  styles: `
    [aria-pressed='true'] {
      border-color: var(--color-accent);
      background: var(--color-accent-soft);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritePicker {
  // [1] inject() → the one root instance. Vue: const store = useFavorites().
  protected readonly store = inject(FavoritesStore);
  protected readonly frameworks = FRAMEWORKS;
}

/** A badge somewhere else in the page that only reads the store. */
@Component({
  selector: 'app-favorite-badge',
  template: `
    <p class="badge">
      ★ <strong class="favorite-count">{{ store.count() }}</strong> favorites:
      <span class="favorite-list">{{ store.ids().join(', ') || 'none yet' }}</span>
    </p>
    <button type="button" (click)="store.clear()">Clear</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem 1rem;
    }

    .badge {
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBadge {
  // [2] Same class → same instance. Try the exercise: add `providers: [FavoritesStore]` here.
  protected readonly store = inject(FavoritesStore);
}

/** The demo: the picker and the badge, side by side but not connected to each other. */
@Component({
  selector: 'app-services-demo',
  imports: [FavoritePicker, FavoriteBadge],
  template: `
    <app-favorite-picker />
    <hr />
    <app-favorite-badge />
  `,
  styles: `
    hr {
      margin: 1rem 0;
      border: none;
      border-top: 1px dashed var(--color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesDemo {}
