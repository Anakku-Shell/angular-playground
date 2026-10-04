import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files. The last three cards walk through the contacts app, one step each.
 */
export const GUIDES = {
  component: {
    label: 'Component',
    question: 'write a component: state, derived values, side effects',
    use: '`@Component`, `signal`, `computed`, `effect`',
    why: 'A `.vue` file and an Angular component hold the same three things: a template, the logic and scoped styles. Angular puts them in a class with a decorator, and its `ref` is called `signal`: you read it by calling it, `count()`, instead of `count.value`.',
    steps: [
      {
        action: 'Click + three times.',
        result:
          '`count` is a signal; `double` and `parity` are `computed()` and follow it, like in Vue.',
      },
      {
        action: 'Reload the page (F5).',
        result:
          'The counter keeps its value: an `effect()` saves it to `sessionStorage` every time it changes, like a `watchEffect`.',
      },
    ],
    snippet: `count = signal(0);                          // ref(0)
double = computed(() => this.count() * 2);  // computed(() => count.value * 2)
effect(() => save(this.count()));           // watchEffect(() => save(count.value))
this.count.update((n) => n + 1);            // count.value++`,
    read: [
      {
        file: 'demos/counter-demo.ts',
        lookFor:
          'The header maps each part of a `.vue` file, then [1] the selector, [2] scoped styles, [3] the signal, [4] computed values, [5] the effect.',
      },
    ],
  },

  template: {
    label: 'Templates',
    question: 'bind values, events, lists and conditions in a template',
    use: '`[prop]`, `(event)`, `[(ngModel)]`, `@if`, `@for`',
    why: 'Template syntax is where Vue and Angular look most alike. The ideas map one to one; only the symbols change: `:` becomes `[ ]`, `@` becomes `( )`, and the `v-` directives become `@` blocks.',
    steps: [
      {
        action: 'Type "Milk" and press Enter.',
        result:
          '`[(ngModel)]` kept the input and the signal in sync (Vue: `v-model`), and `(ngSubmit)` added the item without reloading the page.',
      },
      {
        action: 'Clear the input.',
        result: 'Add is disabled: `[disabled]` binds a property, like `:disabled`.',
      },
      {
        action: 'Tick "Bread", then remove every item with ✕.',
        result:
          '`[class.done]` strikes it through; with no items left, the `@else` branch becomes the `@if` one and shows "The list is empty."',
      },
    ],
    snippet: `<input [(ngModel)]="newItem" />              <!-- v-model -->
<button [disabled]="!newItem()" (click)="add()">  <!-- :disabled  @click -->

@for (item of items(); track item.id) {         <!-- v-for + :key -->
  <li [class.done]="item.done">{{ item.name }}</li>
}`,
    read: [
      {
        file: 'demos/template-demo.ts',
        lookFor:
          'Each binding has its Vue version in a comment: [2] two-way, [3] property, [4] if, [5] for, [6] class, [7] event, [8] updating an array.',
      },
    ],
  },

  parentChild: {
    label: 'Parent & child',
    question: 'pass data down, events up, and content into a child',
    use: '`input()`, `output()`, `model()`, `<ng-content>`',
    why: 'Vue\'s `defineProps`, `defineEmits`, `defineModel` and slots all have a direct twin. The parent side changes the most: `[ ]` sends a value, `( )` listens to an event, and `[( )]` ("banana in a box") is `v-model`.',
    steps: [
      {
        action: 'Click + on Adults.',
        result:
          "The child wrote its `model()` and the parent's `adults` signal and `total` followed: two-way binding with `[(value)]`.",
      },
      {
        action: 'Keep clicking + on Children past 3.',
        result:
          'The value stops at 3 and "last (limit) event" shows a message: the child emitted its `output()` and the parent handled it.',
      },
      {
        action: 'Look at the labels "Adults" and "Children".',
        result:
          'They are written in the parent and shown inside the child through `<ng-content />`, like a default slot.',
      },
    ],
    snippet: `// child
value = model(0);              // defineModel
max = input(10);               // defineProps
limit = output<number>();      // defineEmits

<!-- parent -->
<app-quantity-stepper [(value)]="adults" [max]="4" (limit)="onLimit($event)">
  Adults                       <!-- slot content -->
</app-quantity-stepper>`,
    read: [
      {
        file: 'demos/quantity-stepper.ts',
        lookFor: 'The child: [1] model, [2] input, [3] output, [4] the slot.',
      },
      {
        file: 'demos/parent-child-demo.ts',
        lookFor: 'The parent: [1] two-way binding, [2] an input, [3] an output and `$event`.',
      },
    ],
  },

  services: {
    label: 'Services',
    question: 'share state and logic between components (Pinia, composables)',
    use: '`@Injectable` + `inject()`',
    why: 'In Vue you share state with Pinia or a composable. In Angular both are a service: a class that dependency injection creates and hands to whoever asks with `inject()`. It is built into the framework, so tests can swap any service for a fake without extra libraries.',
    steps: [
      {
        action: 'Star Angular and Vue in the top row.',
        result:
          'The badge below updates. The two components never talk to each other: both inject the same `FavoritesStore`.',
      },
      {
        action: 'Open another topic, then come back to this card.',
        result:
          "Your stars are still there: `providedIn: 'root'` makes one instance for the whole app, like a Pinia store.",
      },
    ],
    snippet: `@Injectable({ providedIn: 'root' })        // defineStore(...)
export class FavoritesStore {
  private readonly idsState = signal<string[]>([]);   // state
  readonly count = computed(() => this.idsState().length);  // getter
  toggle(id: string) { … }                  // action
}

store = inject(FavoritesStore);              // const store = useFavorites()`,
    read: [
      {
        file: 'demos/favorites-store.ts',
        lookFor:
          'The Pinia ↔ service map in the header, then [1] root, [2] state, [3] getters, [4] actions.',
      },
      {
        file: 'demos/services-demo.ts',
        lookFor: '[1] and [2]: two components injecting the same instance.',
      },
    ],
  },

  form: {
    label: 'CRUD: Form',
    question: 'build a form with validation (CRUD step 1)',
    use: 'Reactive Forms: `FormGroup`, `Validators`',
    why: 'Vue leaves forms to `v-model` plus a library such as VeeValidate. Angular ships them: you describe the fields and their validators in the class, bind the inputs with `formControlName`, and the form tracks value, validity and touched state for you.',
    steps: [
      {
        action: 'In the contacts app above, click Create with the form empty.',
        result:
          'Nothing is sent and every field shows its error: `submit()` saw `form.invalid` and called `markAllAsTouched()`.',
      },
      {
        action: 'Type "a" in First name, then click the next field.',
        result:
          '"At least 2 characters": the error shows once the field is touched. `form.status` below the form says INVALID.',
      },
      {
        action: 'Fill every field correctly (age 18 or more).',
        result: '`form.status` turns VALID and `form.value` shows the object that will be sent.',
      },
    ],
    snippet: `form = inject(NonNullableFormBuilder).group({
  firstName: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
});

<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="firstName" />
  @if (form.controls.firstName.touched && form.controls.firstName.invalid) { … }`,
    read: [
      {
        file: 'crud/contacts-app.ts',
        lookFor: 'The steps in the header, then [1] the form model and [4] `submit()`.',
      },
      {
        file: 'crud/contacts-app.html',
        lookFor: '[2] binding the form, [3] showing an error only after the field was touched.',
      },
    ],
  },

  request: {
    label: 'CRUD: Request',
    question: 'send the data to the back end (CRUD step 2)',
    use: 'a service with `HttpClient`',
    why: 'Components should not build URLs. As you would put axios calls in an `api/` module, Angular puts them in a service that wraps `HttpClient`. The difference: it returns an Observable, which sends nothing until someone subscribes.',
    steps: [
      {
        action: 'Fill the form and click Create.',
        result:
          '"What was sent" shows a POST to `/users/add` with status 201, and "Last body sent" the JSON. `HttpClient` serialised the object for you.',
      },
      {
        action: 'Click Edit on Emily, change her age and click Save changes.',
        result: 'A PUT to `/users/1` with the whole contact as the body.',
      },
      {
        action: 'Click Delete on another contact.',
        result: 'A DELETE to its URL, with no body. The row goes away once the server answers.',
      },
    ],
    snippet: `@Injectable({ providedIn: 'root' })
export class ContactsApi {
  private readonly http = inject(HttpClient);

  create(draft: ContactDraft): Observable<Contact> {
    return this.http.post<Contact>(\`\${this.baseUrl}/users/add\`, draft);
  }
}

this.api.create(draft).subscribe(...);   // only now is the POST sent`,
    read: [
      {
        file: 'crud/contacts-api.ts',
        lookFor:
          'The axios comparison in the header, then [1] inject, [2] GET, [3] POST, [4] PUT, [5] DELETE.',
      },
      {
        file: 'crud/contacts-app.ts',
        lookFor: '[5] the component asks the service for the request.',
      },
      {
        file: 'crud/contact.ts',
        lookFor: 'The types shared by the form, the service and the list.',
      },
    ],
  },

  response: {
    label: 'CRUD: Response',
    question: 'handle the answer: loading, success and errors (CRUD step 3)',
    use: '`subscribe({ next, error })`',
    why: 'Every request ends in success or error, and the UI must show both. Where Vue code uses `try / catch` around `await`, Angular code usually subscribes with a `next` and an `error` callback and keeps the state (saving, error, list) in signals.',
    steps: [
      {
        action: 'Create a contact.',
        result:
          'The button says "Saving…" for a moment, then the new row appears and the form clears. The list was updated with the object the server returned.',
      },
      {
        action: 'Tick "Make the server fail", fill the form and click Create.',
        result:
          'A red "The server failed" message; the form keeps what you typed so you can retry. Untick it and click Create again.',
      },
      {
        action: 'Edit the contact you created and save.',
        result:
          'A 404: DummyJSON never stored it. This is a real error answer, handled by the same `error` callback.',
      },
      {
        action: 'Click "Reload from server".',
        result:
          'A new GET brings back the original five contacts: DummyJSON fakes every write, so nothing you did was saved.',
      },
    ],
    snippet: `this.saving.set(true);
this.api.create(draft).subscribe({
  next: (saved) => {                                  // try { await ... }
    this.contacts.update((list) => [...list, saved]);
    this.saving.set(false);
    this.form.reset();
  },
  error: (e: unknown) => {                            // catch (e) { ... }
    this.error.set(errorMessage(e));
    this.saving.set(false);
  },
});`,
    read: [
      {
        file: 'crud/contacts-app.ts',
        lookFor:
          '[6] success: update the list with a new array, [7] error: keep the form, [8] the first load and delete.',
      },
      {
        file: 'crud/contacts-app.html',
        lookFor: 'The loading, error and notice block, and the child list with its outputs.',
      },
      {
        file: 'crud/contact-list.ts',
        lookFor: 'The child: [1] inputs, [2] outputs.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
