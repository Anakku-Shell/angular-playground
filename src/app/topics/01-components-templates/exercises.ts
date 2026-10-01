import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  interpolation: {
    files: ['demos/interpolation-demo.ts', 'demos/interpolation-demo.html'],
    tasks: [
      {
        task: 'Add a `totalWithVat` computed signal (total × 1.21) and show it in a new row.',
        expect: 'A "With VAT" row that changes with the − 1 / + 1 buttons.',
        solution: `// interpolation-demo.ts
protected readonly totalWithVat = computed(() => this.total() * 1.21);

<!-- interpolation-demo.html -->
<dt>With VAT</dt>
<dd>{{ totalWithVat() }}</dd>`,
      },
      {
        task: 'Predict first, then try: change `{{ user().name }}` to `{{ user.name }}`.',
        expect:
          'It still compiles, with warning NG8109 "user is a function and should be invoked" in the terminal. The page shows the signal function\'s own `name` (every JS function has one), not Ada. Put the parentheses back.',
        solution: `{{ user().name }}   <!-- call the signal to read its value -->`,
      },
      {
        task: 'Interpolation also works inside an attribute: give the email `<dd>` a tooltip with `title="..."`.',
        expect: 'Hovering the email shows "Email: none" or "Email: ada@example.com".',
        solution: `<dd title="Email: {{ user().email ?? 'none' }}">{{ user().email ?? 'No email on file' }}</dd>

<!-- Same result as a property binding: [title]="'Email: ' + (user().email ?? 'none')" -->`,
      },
    ],
  },

  bindings: {
    files: ['demos/bindings-demo.ts', 'demos/bindings-demo.html'],
    tasks: [
      {
        task: 'Add a "Bold" checkbox backed by a new `bold` signal, and bind `[style.font-weight]` on the preview box.',
        expect: 'The preview text turns bold and back. With `null` the inline style is removed.',
        solution: `// bindings-demo.ts
protected readonly bold = signal(false);

<!-- bindings-demo.html, next to the other checkboxes -->
<label>
  <input type="checkbox" [checked]="bold()" (change)="bold.set(!bold())" />
  Bold
</label>

<!-- on the .preview div -->
[style.font-weight]="bold() ? 700 : null"`,
      },
      {
        task: 'Rewrite `[class]="{ \'is-rounded\': rounded() }"` with the string form, then with the array form.',
        expect: 'The "Rounded" checkbox behaves exactly as before in both versions.',
        solution: `[class]="rounded() ? 'is-rounded' : ''"        <!-- string -->
[class]="rounded() ? ['is-rounded'] : []"      <!-- array -->
[class.is-rounded]="rounded()"                 <!-- one class: the simplest here -->`,
      },
      {
        task: 'Add `[attr.data-size]` to the preview: `"large"` above 300 px, otherwise `null`. Watch it in the DevTools Elements panel.',
        expect:
          'The attribute appears past 300 px and disappears below it (with `false` it would stay as the text "false").',
        solution: `[attr.data-size]="width() > 300 ? 'large' : null"`,
      },
    ],
  },

  events: {
    files: ['demos/events-demo.ts', 'demos/events-demo.html'],
    tasks: [
      {
        task: 'Add a "Remove last" button that drops the last item of the list.',
        expect: 'Each click removes one item.',
        solution: `// events-demo.ts
protected removeLast(): void {
  this.items.update((items) => items.slice(0, -1)); // a new array: the signal sees a change
}

<!-- events-demo.html -->
<button type="button" (click)="removeLast()">Remove last</button>`,
      },
      {
        task: 'Change `(click)` on the dashed box to `(mousemove)`. Any DOM event name works.',
        expect: 'The coordinates update while the mouse moves over the box.',
        solution: `<button type="button" class="click-area" (mousemove)="onClick($event)">...</button>
<!-- MouseEvent for both, so onClick still fits. Rename it to onPointer to be honest. -->`,
      },
      {
        task: 'Make Shift+Enter add the item in upper case, with a key filter: `(keyup.shift.enter)`.',
        expect:
          'Enter adds "milk", Shift+Enter adds "MILK". `keyup.enter` does not fire when Shift is held.',
        solution: `<!-- events-demo.html, on the input -->
(keyup.shift.enter)="addUpper()"

// events-demo.ts
protected addUpper(): void {
  this.draft.update((text) => text.toUpperCase());
  this.add();
}`,
      },
    ],
  },

  twoWay: {
    files: ['demos/two-way-demo.ts', 'demos/two-way-demo.html'],
    tasks: [
      {
        task: 'Add a "Shout" checkbox with `[(ngModel)]` bound to a new `shout` signal, and greet in upper case when it is ticked.',
        expect:
          '"Hello, ADA!" while ticked. `ngModel` works on checkboxes too (it binds `checked`).',
        solution: `// two-way-demo.ts
protected readonly shout = signal(false);

<!-- two-way-demo.html -->
<label><input type="checkbox" [(ngModel)]="shout" /> Shout</label>

@let who = name() || 'stranger';
<p class="demo-row">Hello, {{ shout() ? who.toUpperCase() : who }}!</p>`,
      },
      {
        task: 'Predict first, then try: write `[(ngModel)]="name()"` (with parentheses).',
        expect:
          'The build fails with NG5002 "Unsupported expression in a two-way binding": it must write back, and `name()` is a value. Pass the signal itself.',
        solution: `<input [(ngModel)]="name" />   <!-- the signal, not its value -->`,
      },
      {
        task: 'Build the same two-way binding without `ngModel`: `[value]` plus `(input)`.',
        expect:
          'It still syncs with the other inputs. This is what `ngModel` saves you on every field.',
        solution: `<!-- two-way-demo.html -->
<input type="text" [value]="name()" (input)="name.set(valueOf($event))" />

// two-way-demo.ts
protected valueOf(event: Event): string {
  return (event.target as HTMLInputElement).value;
}`,
      },
    ],
  },

  templateRefs: {
    files: ['demos/template-refs-demo.html'],
    tasks: [
      {
        task: 'Add a "Clear" button that empties the input using only the `#nameInput` reference (no class code).',
        expect:
          'The input empties. Template statements can write to a property of a template variable.',
        solution: `<button type="button" (click)="nameInput.value = ''">Clear</button>`,
      },
      {
        task: 'Fix the gotcha: make the `nameInput.value` row update while you type, by adding an event binding that does nothing: `(input)="0"`.',
        expect:
          'The row follows the input now: any bound event schedules a render. It works, but it is a hack; a signal is the real fix.',
        solution: `<input #nameInput type="text" (input)="0" placeholder="Type, then press Greet" />`,
      },
    ],
  },

  let: {
    files: ['demos/let-demo.html'],
    tasks: [
      {
        task: 'Add a 10 % discount for VIP customers: `@let discount = customer?.vip ? subtotal * 0.1 : 0;`, show it in a row and subtract it from `total`.',
        expect:
          'After 1.5 s the discount row shows $2.50 and the total drops. You will need to move `@let customer` up: a `@let` is only visible after its declaration.',
        solution: `@let customer = customer$ | async;
@let subtotal = quantity() * unitPrice;
@let discount = customer?.vip ? subtotal * 0.1 : 0;
@let shipping = subtotal >= 50 ? 0 : 4.99;
@let total = subtotal - discount + shipping;

<dt>VIP discount</dt>
<dd>{{ discount | currency }}</dd>`,
      },
      {
        task: 'Predict first, then try: add `<button (click)="total = 0">Reset</button>`.',
        expect:
          'The build fails with NG8015 "Cannot assign to @let declaration". State that changes belongs in a signal in the class.',
        solution: `// let-demo.ts: state you want to change lives in the class
protected reset(): void {
  this.quantity.set(0);
}

<!-- let-demo.html -->
<button type="button" (click)="reset()">Reset</button>`,
      },
    ],
  },

  pipes: {
    files: ['demos/pipes-demo.ts', 'demos/pipes-demo.html'],
    tasks: [
      {
        task: "Show the price in Japanese yen: `currency: 'JPY'`.",
        expect: '¥1,235: the pipe knows that yen have no decimals and rounds.',
        solution: `<dd>{{ price | currency: 'JPY' }}</dd>`,
      },
      {
        task: 'Show the launch date as day/month/year with a custom format.',
        expect: '15/01/2026.',
        solution: `<dd>{{ launch | date: 'dd/MM/yyyy' }}</dd>`,
      },
      {
        task: 'Sort the `keyvalue` scores by value, highest first. `keyvalue` accepts a compare function as its argument.',
        expect: 'alice: 12, bob: 9, carol: 7.',
        solution: `// pipes-demo.ts (import KeyValue from @angular/common)
protected readonly byValueDesc = (a: KeyValue<string, number>, b: KeyValue<string, number>) =>
  b.value - a.value;

<!-- pipes-demo.html -->
@for (entry of scores | keyvalue: byValueDesc; track entry.key) { ... }`,
      },
    ],
  },

  encapsulation: {
    files: [
      'demos/encapsulation/emulated-sample.ts',
      'demos/encapsulation/shadow-sample.ts',
      'demos/encapsulation/none-sample.ts',
      'demos/encapsulation-demo.scss',
    ],
    tasks: [
      {
        task: 'In `emulated-sample.ts`, change the border colour on hover with `:host(:hover)`. Then inspect the element: find the `_nghost-…` and `_ngcontent-…` attributes Angular added.',
        expect: 'The Emulated box border turns red on hover; the other boxes do not react.',
        solution: `:host(:hover) {
  border-color: var(--color-accent);
}`,
      },
      {
        task: 'Theme the ShadowDom sample from outside: use `var(--sample-color, inherit)` for its text colour, and set `--sample-color` on `.samples` in `encapsulation-demo.scss`.',
        expect:
          'The ShadowDom text changes colour although no outside rule can reach into a shadow root. Custom properties inherit through it.',
        solution: `// shadow-sample.ts
.enc-sample { margin-top: 0; font-style: italic; color: var(--sample-color, inherit); }

// encapsulation-demo.scss
.samples { --sample-color: seagreen; }`,
      },
      {
        task: 'Predict first, then try: switch `none-sample.ts` to `ViewEncapsulation.Emulated` and tick the checkbox.',
        expect:
          'The leak is gone, and so is the dashed border: `.none-sample-host` is now scoped to elements inside the template, and the host is not one of them. `:host` fixes it.',
        solution: `// none-sample.ts: style the host with :host and drop the host class
:host {
  display: block;
  padding: 0.75rem;
  border: 2px dashed var(--color-warning);
  border-radius: var(--radius);
}`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
