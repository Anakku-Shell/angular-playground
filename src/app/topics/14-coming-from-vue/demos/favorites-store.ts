import { computed, Injectable, signal } from '@angular/core';

/*
 * A STORE = A SERVICE. This is the Angular version of a Pinia setup store:
 *
 *   export const useFavorites = defineStore('favorites', () => {   @Injectable({ providedIn: 'root' })
 *     const ids = ref<string[]>([])                                 export class FavoritesStore {
 *     const count = computed(() => ids.value.length)                  ids, count, toggle() below
 *     function toggle(id) { … }                                      }
 *     return { ids, count, toggle }
 *   })
 *   const store = useFavorites()                                   store = inject(FavoritesStore)
 *
 * Read next: services-demo.ts, where two components inject it.
 */

// [1] providedIn: 'root' → ONE instance for the whole app, created the first time someone asks for
// it. Like a Pinia store: every component that injects it gets the same object.
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  // [2] Private writable state, public read-only view: only the store's methods can change it.
  // Pinia exposes the refs directly; this is the common Angular convention.
  private readonly idsState = signal<readonly string[]>([]);
  readonly ids = this.idsState.asReadonly();

  // [3] Getters → computed.
  readonly count = computed(() => this.ids().length);

  // [4] Actions → methods.
  toggle(id: string): void {
    this.idsState.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  has(id: string): boolean {
    return this.ids().includes(id);
  }

  clear(): void {
    this.idsState.set([]);
  }
}
