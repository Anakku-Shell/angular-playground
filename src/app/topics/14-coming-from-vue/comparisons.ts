import { Comparison } from './ui/vue-compare';

/**
 * The "Vue → Angular" block of each card: an equivalence table and the same small example in both
 * frameworks. Keys match `guides.ts`. The Angular samples are trimmed versions of the demo files.
 */
export const COMPARISONS = {
  component: {
    rows: [
      {
        vue: '`Counter.vue` (template + script + style)',
        angular: '`@Component` class + template + styles',
      },
      { vue: '`<script setup>`', angular: 'the class body' },
      { vue: '`const count = ref(0)`', angular: '`count = signal(0)`' },
      { vue: '`count.value` / `{{ count }}`', angular: '`this.count()` / `{{ count() }}`' },
      { vue: '`count.value++`', angular: '`count.set(1)`, `count.update((n) => n + 1)`' },
      { vue: '`computed(() => …)`', angular: '`computed(() => …)`' },
      { vue: '`watchEffect(() => …)`', angular: '`effect(() => …)`' },
      {
        vue: '`watch(count, (now, before) => …)`',
        angular: 'no direct twin: `effect`, or `toObservable(count)` + RxJS',
      },
      { vue: '`<style scoped>`', angular: '`styles` (scoped by default)' },
      {
        vue: '`import Counter from …` and use it',
        angular: "add `Counter` to the parent's `imports: []`",
      },
    ],
    vueFile: 'Counter.vue',
    vue: `<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

watchEffect(() => {
  sessionStorage.setItem('count', String(count.value))
})

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
  <p>double: {{ double }}</p>
</template>

<style scoped>
button { font-weight: 600; }
</style>`,
    angularFile: 'counter.ts',
    angular: `@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">{{ count() }}</button>
    <p>double: {{ double() }}</p>
  \`,
  styles: \`button { font-weight: 600; }\`,
})
export class Counter {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      sessionStorage.setItem('count', String(this.count()));
    });
  }

  increment() {
    this.count.update((n) => n + 1);
  }
}`,
  },

  template: {
    rows: [
      { vue: '`{{ value }}`', angular: '`{{ value() }}` (call signals)' },
      { vue: '`:disabled="x"` (`v-bind`)', angular: '`[disabled]="x"`' },
      { vue: '`@click="add"` (`v-on`)', angular: '`(click)="add()"` (with the parentheses)' },
      { vue: '`v-model="text"`', angular: '`[(ngModel)]="text"` (needs `FormsModule`)' },
      {
        vue: '`v-if` / `v-else-if` / `v-else`',
        angular: '`@if (…) { } @else if (…) { } @else { }`',
      },
      {
        vue: '`v-for="item in items" :key="item.id"`',
        angular: '`@for (item of items(); track item.id) { }`',
      },
      { vue: '(nothing)', angular: '`@empty { }` inside `@for`: shown when the list is empty' },
      { vue: '`v-show`', angular: '`[hidden]="x"` or a class' },
      { vue: '`:class="{ done: item.done }"`', angular: '`[class.done]="item.done"`' },
      { vue: '`:style="{ color }"`', angular: '`[style.color]="color"`' },
      { vue: '`@submit.prevent`', angular: '`(ngSubmit)` on a form (prevented for you)' },
      {
        vue: '`items.value.push(x)`',
        angular: '`items.update((list) => [...list, x])`: a new array',
      },
    ],
    vueFile: 'ShoppingList.vue',
    vue: `<script setup lang="ts">
const newItem = ref('')
const items = ref([{ id: 1, name: 'Bread', done: false }])

function add() {
  items.value.push({ id: Date.now(), name: newItem.value, done: false })
  newItem.value = ''
}
</script>

<template>
  <form @submit.prevent="add">
    <input v-model="newItem" />
    <button :disabled="!newItem.trim()">Add</button>
  </form>

  <p v-if="items.length === 0">The list is empty.</p>
  <ul v-else>
    <li v-for="item in items" :key="item.id"
        :class="{ done: item.done }">
      <input type="checkbox" v-model="item.done" />
      {{ item.name }}
    </li>
  </ul>
</template>`,
    angularFile: 'shopping-list.ts (template)',
    angular: `<form (ngSubmit)="add()">
  <input name="newItem" [(ngModel)]="newItem" />
  <button [disabled]="!newItem().trim()">Add</button>
</form>

@if (items().length === 0) {
  <p>The list is empty.</p>
} @else {
  <ul>
    @for (item of items(); track item.id) {
      <li [class.done]="item.done">
        <input type="checkbox" [checked]="item.done"
               (change)="toggle(item.id)" />
        {{ item.name }}
      </li>
    }
  </ul>
}

// in the class
add() {
  this.items.update((items) =>
    [...items, { id: Date.now(), name: this.newItem(), done: false }]);
  this.newItem.set('');
}`,
  },

  parentChild: {
    rows: [
      { vue: '`defineProps<{ max?: number }>()`', angular: '`max = input(10)`' },
      { vue: 'a required prop', angular: '`input.required<number>()`' },
      {
        vue: "`defineEmits(['limit'])` + `emit('limit', 4)`",
        angular: '`limit = output<number>()` + `this.limit.emit(4)`',
      },
      { vue: '`defineModel<number>()`', angular: '`value = model(0)`' },
      { vue: '`<Child :max="4" />`', angular: '`<app-child [max]="4" />`' },
      { vue: '`<Child @limit="onLimit" />`', angular: '`<app-child (limit)="onLimit($event)" />`' },
      { vue: '`<Child v-model="adults" />`', angular: '`<app-child [(value)]="adults" />`' },
      { vue: '`<slot />`', angular: '`<ng-content />`' },
      { vue: '`<slot name="footer" />`', angular: '`<ng-content select="[footer]" />`' },
      {
        vue: 'scoped slots (`<slot :item="item" />`)',
        angular: '`<ng-template>` + `ngTemplateOutlet` (rarer)',
      },
    ],
    vueFile: 'QuantityStepper.vue',
    vue: `<script setup lang="ts">
const value = defineModel<number>({ default: 0 })
const props = defineProps<{ max?: number }>()
const emit = defineEmits<{ limit: [max: number] }>()

function change(delta: number) {
  const next = value.value + delta
  if (next > (props.max ?? 10)) return emit('limit', props.max ?? 10)
  value.value = Math.max(0, next)
}
</script>

<template>
  <slot />
  <button @click="change(-1)">−</button> {{ value }}
  <button @click="change(1)">+</button>
</template>

<!-- parent -->
<QuantityStepper v-model="adults" :max="4" @limit="onLimit">
  Adults
</QuantityStepper>`,
    angularFile: 'quantity-stepper.ts',
    angular: `@Component({
  selector: 'app-quantity-stepper',
  template: \`
    <ng-content />
    <button (click)="change(-1)">−</button> {{ value() }}
    <button (click)="change(1)">+</button>
  \`,
})
export class QuantityStepper {
  value = model(0);
  max = input(10);
  limit = output<number>();

  change(delta: number) {
    const next = this.value() + delta;
    if (next > this.max()) return this.limit.emit(this.max());
    this.value.set(Math.max(0, next));
  }
}

<!-- parent -->
<app-quantity-stepper [(value)]="adults" [max]="4"
                      (limit)="onLimit($event)">
  Adults
</app-quantity-stepper>`,
  },

  services: {
    rows: [
      {
        vue: "Pinia `defineStore('id', () => { … })`",
        angular: "`@Injectable({ providedIn: 'root' })` class",
      },
      { vue: '`const store = useFavorites()`', angular: '`store = inject(FavoritesStore)`' },
      { vue: 'state: `ref`', angular: 'a `signal` (usually private + `asReadonly()`)' },
      { vue: 'getters: `computed`', angular: '`computed`' },
      { vue: 'actions: functions', angular: 'methods' },
      {
        vue: 'a composable (`useX()`), new state per call',
        angular: "a service in a component's `providers: []`: one per component",
      },
      {
        vue: "`provide('key', value)` / `inject('key')`",
        angular: '`providers: [{ provide: TOKEN, useValue }]` / `inject(TOKEN)`',
      },
      {
        vue: 'mocking a store in tests: `createTestingPinia()`',
        angular: '`{ provide: FavoritesStore, useValue: fake }`: built in',
      },
    ],
    vueFile: 'stores/favorites.ts',
    vue: `export const useFavorites = defineStore('favorites', () => {
  const ids = ref<string[]>([])
  const count = computed(() => ids.value.length)

  function toggle(id: string) {
    ids.value = ids.value.includes(id)
      ? ids.value.filter((x) => x !== id)
      : [...ids.value, id]
  }
  return { ids, count, toggle }
})

// in any component
const store = useFavorites()
store.toggle('Vue')`,
    angularFile: 'favorites-store.ts',
    angular: `@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly idsState = signal<string[]>([]);
  readonly ids = this.idsState.asReadonly();
  readonly count = computed(() => this.ids().length);

  toggle(id: string) {
    this.idsState.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }
}

// in any component
store = inject(FavoritesStore);
this.store.toggle('Vue');`,
  },

  form: {
    rows: [
      {
        vue: "`reactive({ email: '' })` + `v-model`",
        angular: "`fb.group({ email: ['', validators] })` + `formControlName`",
      },
      {
        vue: 'VeeValidate / Vuelidate rules',
        angular: '`Validators.required`, `email`, `min`, `minLength`… (built in)',
      },
      { vue: 'a custom rule function', angular: 'a function `(control) => errors | null`' },
      { vue: '`errors.email`', angular: "`form.controls.email.hasError('email')`" },
      {
        vue: '`meta.touched`, `meta.valid`',
        angular: '`control.touched`, `form.valid`, `form.status`',
      },
      { vue: '`@submit.prevent="onSubmit"`', angular: '`(ngSubmit)="submit()"`' },
      {
        vue: '`resetForm()`, `setValues()`',
        angular: '`form.reset()`, `form.patchValue(contact)`',
      },
      { vue: '(by hand)', angular: '`markAllAsTouched()`: show every error at once' },
    ],
    vueFile: 'ContactForm.vue (VeeValidate)',
    vue: `<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    firstName: yup.string().required().min(2),
    email: yup.string().required().email(),
  }),
})
const [firstName] = defineField('firstName')
const [email] = defineField('email')

const onSubmit = handleSubmit((values) => save(values))
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="firstName" />
    <p v-if="errors.firstName">{{ errors.firstName }}</p>
    <input v-model="email" type="email" />
    <p v-if="errors.email">{{ errors.email }}</p>
    <button>Create</button>
  </form>
</template>`,
    angularFile: 'contacts-app.ts + .html',
    angular: `form = inject(NonNullableFormBuilder).group({
  firstName: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
});

submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();   // show every error
    return;
  }
  this.save(this.form.getRawValue());
}

<!-- template -->
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="firstName" />
  @if (form.controls.firstName.touched && form.controls.firstName.invalid) {
    <p>First name is required.</p>
  }
  <input formControlName="email" type="email" />
  <button type="submit">Create</button>
</form>`,
  },

  request: {
    rows: [
      { vue: "`import axios from 'axios'`", angular: '`http = inject(HttpClient)`' },
      {
        vue: '`axios.create({ baseURL })`',
        angular: 'a base URL in the service (here an `InjectionToken`)',
      },
      {
        vue: '`await axios.get<T>(url, { params })` → `res.data`',
        angular: '`http.get<T>(url, { params })` → the body directly',
      },
      { vue: '`axios.post(url, body)`', angular: '`http.post<T>(url, body)`' },
      { vue: '`axios.put` / `axios.delete`', angular: '`http.put<T>` / `http.delete`' },
      {
        vue: 'returns a Promise: the request is already sent',
        angular: 'returns an Observable: sent on `subscribe()`',
      },
      {
        vue: '`axios.interceptors.request.use(…)`',
        angular: '`withInterceptors([authInterceptor])` in `app.config.ts`',
      },
      {
        vue: '`api/contacts.ts` module',
        angular: 'a `ContactsApi` service: components never build URLs',
      },
    ],
    vueFile: 'api/contacts.ts',
    vue: `const api = axios.create({ baseURL: 'https://dummyjson.com' })

export async function listContacts(): Promise<Contact[]> {
  const res = await api.get<ContactPage>('/users', { params: { limit: 5 } })
  return res.data.users
}

export async function createContact(draft: ContactDraft) {
  const res = await api.post<Contact>('/users/add', draft)
  return res.data
}

export const updateContact = (id: number, draft: ContactDraft) =>
  api.put<Contact>(\`/users/\${id}\`, draft).then((r) => r.data)

export const deleteContact = (id: number) => api.delete(\`/users/\${id}\`)`,
    angularFile: 'contacts-api.ts',
    angular: `@Injectable({ providedIn: 'root' })
export class ContactsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(): Observable<Contact[]> {
    return this.http
      .get<ContactPage>(\`\${this.baseUrl}/users\`, { params: { limit: 5 } })
      .pipe(map((page) => page.users));
  }

  create(draft: ContactDraft): Observable<Contact> {
    return this.http.post<Contact>(\`\${this.baseUrl}/users/add\`, draft);
  }

  update(id: number, draft: ContactDraft): Observable<Contact> {
    return this.http.put<Contact>(\`\${this.baseUrl}/users/\${id}\`, draft);
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(\`\${this.baseUrl}/users/\${id}\`);
  }
}`,
  },

  response: {
    rows: [
      {
        vue: '`try { const c = await createContact(d) }`',
        angular: '`api.create(d).subscribe({ next: (c) => … })`',
      },
      { vue: '`catch (e) { … }`', angular: '`error: (e: HttpErrorResponse) => …`' },
      {
        vue: '`finally { saving.value = false }`',
        angular: 'set it in both `next` and `error` (or `finalize()`)',
      },
      { vue: '`e.response?.status`', angular: '`e.status` (0 when the network failed)' },
      { vue: '`contacts.value.push(c)`', angular: '`contacts.update((list) => [...list, c])`' },
      { vue: 'need a Promise anyway?', angular: '`await firstValueFrom(api.create(d))`' },
      {
        vue: 'global error toast in an axios interceptor',
        angular: 'a functional interceptor with `catchError` (`core/http/`)',
      },
    ],
    vueFile: 'ContactsPage.vue',
    vue: `const contacts = ref<Contact[]>([])
const saving = ref(false)
const error = ref<string | null>(null)

async function onSubmit(draft: ContactDraft) {
  saving.value = true
  error.value = null
  try {
    const saved = await createContact(draft)
    contacts.value.push(saved)
    resetForm()
  } catch (e) {
    error.value = messageFor(e)   // the form keeps its values
  } finally {
    saving.value = false
  }
}`,
    angularFile: 'contacts-app.ts',
    angular: `contacts = signal<Contact[]>([]);
saving = signal(false);
error = signal<string | null>(null);

submit() {
  this.saving.set(true);
  this.error.set(null);
  this.api.create(this.toDraft()).subscribe({
    next: (saved) => {
      this.contacts.update((list) => [...list, saved]);
      this.saving.set(false);
      this.form.reset();
    },
    error: (e: unknown) => {
      this.error.set(errorMessage(e));   // the form keeps its values
      this.saving.set(false);
    },
  });
}`,
  },
} as const satisfies Record<string, Comparison>;
