import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  component: {
    files: ['demos/counter-demo.ts'],
    tasks: [
      {
        task: 'Add a `step = signal(1)` and two buttons "step 1" / "step 5" that set it. Make + and − use the step.',
        expect:
          'With step 5 selected, + goes 0 → 5 → 10. Reading a signal inside `update()` is fine.',
        solution: `protected readonly step = signal(1);

protected increment(): void {
  this.count.update((n) => n + this.step());
}

<!-- template -->
<button type="button" (click)="step.set(1)">step 1</button>
<button type="button" (click)="step.set(5)">step 5</button>`,
      },
      {
        task: 'Add a computed `isBig` that is true above 10, and show "big!" only when it is true.',
        expect:
          'At 11 the text appears; at 10 it goes away. Vue: `v-if="isBig"`, here `@if (isBig())`.',
        solution: `protected readonly isBig = computed(() => this.count() > 10);

@if (isBig()) {
  <strong>big!</strong>
}`,
      },
    ],
  },

  template: {
    files: ['demos/template-demo.ts'],
    tasks: [
      {
        task: 'Add a "Clear done" button that removes every ticked item. Show it only when at least one item is done.',
        expect: 'Tick Coffee: the button is there. Click it: Coffee is gone and the button hides.',
        solution: `<!-- template -->
@if (remaining() < items().length) {
  <button type="button" (click)="clearDone()">Clear done</button>
}

// class
protected clearDone(): void {
  this.items.update((items) => items.filter((item) => !item.done));
}`,
      },
      {
        task: 'Predict first, then try: replace the body of `toggle()` with `this.items().find((i) => i.id === id)!.done = true` (remove `readonly` from `done` so it compiles).',
        expect:
          'Clicking a checkbox no longer strikes the item through: the array is the same object, so the signal does not notify. In Vue the proxy would have caught it. Undo the change.',
        solution: `// Always replace: items.update((items) => items.map(...)) creates a new array.`,
      },
    ],
  },

  parentChild: {
    files: ['demos/quantity-stepper.ts', 'demos/parent-child-demo.ts'],
    tasks: [
      {
        task: 'Add a required input `unit` to the stepper (`input.required<string>()`) and show it after the value. Do not pass it from the parent yet, and look at the terminal.',
        expect:
          'The build fails: a required input is missing. Pass `unit="people"` (a plain string, no brackets) and it compiles again. Vue would only warn at runtime.',
        solution: `// quantity-stepper.ts
readonly unit = input.required<string>();
<output class="value">{{ value() }} {{ unit() }}</output>

// parent-child-demo.ts
<app-quantity-stepper unit="people" [(value)]="adults" ...>`,
      },
      {
        task: 'Add a named slot: in the stepper put `<ng-content select="[hint]" />` after the + button, and in the parent add `<small hint>max 4</small>` inside Adults.',
        expect:
          '"max 4" appears after the + of Adults only. `select` is a CSS selector, here an attribute: Vue\'s `<template #hint>`.',
        solution: `<!-- stepper -->
<button type="button" (click)="change(1)" aria-label="More">+</button>
<ng-content select="[hint]" />

<!-- parent -->
<app-quantity-stepper [(value)]="adults" [max]="4" (limit)="onLimit('adults', $event)">
  Adults
  <small hint>max 4</small>
</app-quantity-stepper>`,
      },
    ],
  },

  services: {
    files: ['demos/services-demo.ts', 'demos/favorites-store.ts'],
    tasks: [
      {
        task: 'In `FavoriteBadge`, add `providers: [FavoritesStore]` to its `@Component`. Star a few frameworks.',
        expect:
          'The badge stays at 0: it now has its own instance, like calling a composable that creates new state. Remove the line to share again.',
        solution: `@Component({
  selector: 'app-favorite-badge',
  providers: [FavoritesStore],
  ...
})`,
      },
      {
        task: 'Add a `last = computed(...)` to the store with the last starred framework, and show it in the badge.',
        expect: 'Star Vue, then Angular: the badge says "last: Angular".',
        solution: `// favorites-store.ts
readonly last = computed(() => this.ids().at(-1) ?? 'none');

// badge template
<span>last: {{ store.last() }}</span>`,
      },
    ],
  },

  form: {
    files: ['crud/contacts-app.ts', 'crud/contacts-app.html'],
    tasks: [
      {
        task: 'Add `Validators.maxLength(20)` to the first name, with its own message "At most 20 characters."',
        expect:
          "Type a long name and leave the field: the new message shows. Check it with `form.controls.firstName.hasError('maxlength')` (all lower case).",
        solution: `firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],

@if (form.controls.firstName.hasError('required')) {
  First name is required.
} @else if (form.controls.firstName.hasError('maxlength')) {
  At most 20 characters.
} @else {
  At least 2 characters.
}`,
      },
      {
        task: 'Disable Create while the form is invalid, instead of showing the errors on click: `[disabled]="busy() || form.invalid"`.',
        expect:
          'The button is grey until every field is valid. Both styles are common; the one in the demo tells the user what is missing.',
        solution: `<button type="submit" class="primary" [disabled]="busy() || form.invalid">`,
      },
    ],
  },

  request: {
    files: ['crud/contacts-api.ts'],
    tasks: [
      {
        task: 'Load 10 contacts instead of 5, sorted by first name. DummyJSON takes `sortBy=firstName` and `order=asc`.',
        expect:
          '"Reload from server" shows 10 rows in alphabetical order, and the URL in "What was sent" has the new params.',
        solution: `export const CONTACTS_LIMIT = 10;

params: {
  limit: CONTACTS_LIMIT,
  select: FIELDS,
  sortBy: 'firstName',
  order: 'asc',
  delay: CONTACTS_DELAY_MS,
},`,
      },
      {
        task: 'Predict first, then try: in `contacts-app.ts`, remove the `.subscribe({...})` from `submit()` and keep only `const request$ = ...`. Click Create.',
        expect:
          'No POST in "What was sent": an Observable is lazy, nothing is sent until someone subscribes. An axios Promise would have sent it at once. Undo the change.',
        solution: `// HttpClient methods return a recipe; subscribe() runs it.`,
      },
    ],
  },

  response: {
    files: ['crud/contacts-app.ts'],
    tasks: [
      {
        task: 'Use `finalize()` so `saving.set(false)` is written once instead of in both callbacks: `request$.pipe(finalize(() => this.saving.set(false))).subscribe(...)`.',
        expect:
          'It behaves the same on success and on error. `finalize` is the `finally` of an Observable.',
        solution: `// import { finalize } from 'rxjs';
request$.pipe(finalize(() => this.saving.set(false))).subscribe({
  next: (saved) => { ... },        // without saving.set(false)
  error: (error: unknown) => this.error.set(errorMessage(error)),
});`,
      },
      {
        task: 'Rewrite `remove()` with async / await, the Vue way: `await firstValueFrom(this.api.remove(contact.id))` inside a try / catch.',
        expect:
          'Delete still works and errors still show. `firstValueFrom` turns the Observable into a Promise; it is fine for one-shot requests like this one.',
        solution: `// import { firstValueFrom } from 'rxjs';
protected async remove(contact: Contact): Promise<void> {
  this.deletingId.set(contact.id);
  this.error.set(null);
  try {
    await firstValueFrom(this.api.remove(contact.id));
    this.contacts.update((list) => list.filter((c) => c.id !== contact.id));
    this.notice.set(\`Deleted \${contact.firstName}.\`);
  } catch (error) {
    this.error.set(errorMessage(error));
  } finally {
    this.deletingId.set(null);
  }
}`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
