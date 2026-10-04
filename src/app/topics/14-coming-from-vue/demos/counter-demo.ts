import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

/*
 * A COMPONENT, PIECE BY PIECE. The same counter as the Counter.vue on this card.
 *
 *   Counter.vue                               Angular
 *   <template>…</template>                    template: `…` (or templateUrl: './x.html')
 *   <script setup>…</script>                  the class below
 *   <style scoped>…</style>                   styles: `…` (scoped by default)
 *   import Counter from './Counter.vue'       imports: [Counter] in the parent's @Component
 */

const STORAGE_KEY = 'vue-counter';

/** A counter with a signal, two computed values and an effect that saves it. */
@Component({
  // [1] The tag name. Vue infers it from the file name; Angular declares it, with a prefix.
  selector: 'app-counter-demo',
  template: `
    <div class="demo-row">
      <!-- Reading a signal in the template: count(), with parentheses. Vue: {{ count }}. -->
      <button type="button" (click)="decrement()">−</button>
      <output class="count">{{ count() }}</output>
      <button type="button" (click)="increment()">+</button>
      <button type="button" (click)="count.set(0)">Reset</button>
    </div>
    <dl class="demo-values">
      <dt>double (computed)</dt>
      <dd class="double">{{ double() }}</dd>
      <dt>parity (computed)</dt>
      <dd class="parity">{{ parity() }}</dd>
    </dl>
  `,
  // [2] Styles only reach this component's template, like <style scoped>.
  styles: `
    .count {
      min-width: 2.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      text-align: center;
    }

    .demo-values {
      margin-top: 1rem;
    }
  `,
  // Always on in this project: the component re-renders only when a signal it reads changes, an
  // input changes or one of its events fires. Vue does this by default.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterDemo {
  // [3] ref(0) → signal(0). Read: count() (Vue: count.value). Write: set() / update().
  protected readonly count = signal(readSaved());

  // [4] computed → computed. Same idea: cached, recalculated when a signal it reads changes.
  protected readonly double = computed(() => this.count() * 2);
  protected readonly parity = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));

  constructor() {
    // [5] watchEffect → effect. It runs once, then again whenever a signal it reads changes.
    // Use it for side effects (storage, logging, a non-Angular library), never to derive a value.
    // Here it saves the count, so it survives a reload (F5).
    effect(() => {
      const value = this.count();
      try {
        sessionStorage.setItem(STORAGE_KEY, String(value));
      } catch {
        // Storage blocked (private mode): the counter still works, it just is not saved.
      }
    });
  }

  // [6] Methods are class methods. Vue: plain functions inside <script setup>.
  protected increment(): void {
    this.count.update((n) => n + 1);
  }

  protected decrement(): void {
    this.count.update((n) => n - 1);
  }
}

/** The last saved value, so the counter survives a reload (F5). */
function readSaved(): number {
  try {
    return Number(sessionStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}
