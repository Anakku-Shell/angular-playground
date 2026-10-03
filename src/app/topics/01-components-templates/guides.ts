import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  interpolation: {
    label: 'Interpolation',
    question: 'show a value of the class as text',
    use: '`{{ expression }}`',
    why: 'A template has to show data from its class: a name, a price, a total. Interpolation prints the result of an expression as text, and Angular updates it whenever that data changes.',
    steps: [
      {
        action: 'Click "+ 1" a few times.',
        result:
          'Arithmetic, computed() and Ternary change together. They all read the `quantity` signal, and when it changes Angular re-renders every place that reads it.',
      },
      {
        action: 'Keep clicking until the quantity reaches 5.',
        result:
          'The ternary switches to "Bulk order". Any expression works, as long as it has no side effects.',
      },
      {
        action: 'Click "Toggle email" twice.',
        result:
          'The Nullish row shows the email, then the fallback again: `??` only replaces `null` and `undefined`.',
      },
      {
        action: 'Look at the "Escaped HTML" row.',
        result:
          'The tags show as text. Interpolation never renders HTML, so data cannot inject markup into the page.',
      },
    ],
    snippet: `// class
protected readonly quantity = signal(3);
protected readonly total = computed(() => this.quantity() * 4.5);

<!-- template: signals are read with () -->
<p>{{ quantity() }} items, {{ total() }} €</p>
<p>{{ quantity() >= 5 ? 'Bulk order' : 'Regular order' }}</p>`,
    read: [
      {
        file: 'demos/interpolation-demo.html',
        lookFor: 'One row per kind of expression, [1] to [5].',
      },
      {
        file: 'demos/interpolation-demo.ts',
        lookFor: '[1] the state, [2] a `computed()` value, [3] the methods the buttons call.',
      },
    ],
  },

  bindings: {
    label: 'Bindings',
    question: 'set a property, attribute, class or style from the class',
    use: '`[prop]`, `[attr.x]`, `[class.x]`, `[style.x]`',
    why: 'Text is not enough: a button has to be disabled, a box highlighted, an element resized. Bindings connect a value of the class to a property, an attribute, a class or a style of an element.',
    steps: [
      {
        action: 'Tick "Disabled".',
        result:
          'The target button greys out. `[disabled]="disabled()"` sets the DOM property `button.disabled`.',
      },
      {
        action: 'Tick "Highlighted", then inspect the button (right click → Inspect).',
        result:
          'The button has `aria-pressed="true"`. ARIA attributes have no DOM property, so they need an attribute binding: `[attr.aria-pressed]`. The box gets the class `is-highlighted` too.',
      },
      {
        action: 'Move the Width slider and pick another color.',
        result:
          'The box follows. `[style.width.px]` adds the unit to the number; `[style.border-color]` uses the value as it is.',
      },
      {
        action: 'Untick "Rounded".',
        result:
          'The corners go square: `[class]="{ \'is-rounded\': rounded() }"` adds or removes each class of the object.',
      },
    ],
    snippet: `<button [disabled]="busy()">Save</button>            a DOM property
<button [attr.aria-pressed]="on()">Bold</button>     an HTML attribute
<div [class.active]="on()">...</div>                  one class, on or off
<div [style.width.px]="width()">...</div>             one style, with a unit`,
    read: [
      {
        file: 'demos/bindings-demo.html',
        lookFor:
          'The controls at the top, then [1] the button and [2] the box. The comments list every binding form.',
      },
      {
        file: 'demos/bindings-demo.ts',
        lookFor: 'One signal per control, and why the fields are `protected readonly`.',
      },
    ],
  },

  events: {
    label: 'Events',
    question: 'run code when the user does something',
    use: '`(event)="handler($event)"`',
    why: 'A page reacts to the user: clicks, typing, keys. An event binding runs a statement of the class when a DOM event fires, and `$event` carries the details of that event.',
    steps: [
      {
        action: 'Click in different places of the big box.',
        result:
          'The text shows where you clicked, read from the `MouseEvent` that the template passes as `$event`.',
      },
      {
        action: 'Type "Buy milk" in the input.',
        result:
          'The draft follows every keystroke: `(input)` fires on each change, and the class stores the value.',
      },
      {
        action: 'Press Enter.',
        result:
          'The item is added and the input is cleared. `(keyup.enter)` only fires for that key.',
      },
      {
        action: 'Type something else and press Escape.',
        result: 'The draft is cleared: `(keyup.escape)` is another key filter.',
      },
    ],
    snippet: `<!-- template -->
<button (click)="onClick($event)">Click me</button>
<input (input)="onInput($event)" (keyup.enter)="add()" />

// class
onClick(event: MouseEvent) { this.last.set(event.offsetX); }
onInput(event: Event) { this.draft.set((event.target as HTMLInputElement).value); }`,
    read: [
      {
        file: 'demos/events-demo.html',
        lookFor: '[1] a click that passes `$event`, [2] the input with its key filters.',
      },
      {
        file: 'demos/events-demo.ts',
        lookFor: 'The handlers: [1] reading the event, [2] adding the item as a new array.',
      },
    ],
  },

  twoWay: {
    label: 'Two-way',
    question: 'keep an input and a value of the class in sync',
    use: '`[(ngModel)]`',
    why: 'A form field goes both ways: the class sets its value, and the user changes it. Two-way binding handles both directions at once, so the input and the signal always hold the same text.',
    steps: [
      {
        action: 'Type in the first input.',
        result:
          'The second input and the greeting follow: both inputs are bound to the same `name` signal.',
      },
      {
        action: 'Type in the second input.',
        result:
          'It works the other way too. That input is written out as `[ngModel]` plus `(ngModelChange)`, which is exactly what `[(ngModel)]` expands to.',
      },
      {
        action: 'Delete all the text.',
        result: 'The greeting says "Hello, stranger!": `||` also replaces the empty string.',
      },
    ],
    snippet: `// class
protected readonly name = signal('Ada');

<!-- template: pass the signal itself, without () -->
<input [(ngModel)]="name" />

<!-- the same, written out -->
<input [ngModel]="name()" (ngModelChange)="name.set($event)" />`,
    read: [
      {
        file: 'demos/two-way-demo.html',
        lookFor: '[1] the short form and [2] the long one, side by side.',
      },
      {
        file: 'demos/two-way-demo.ts',
        lookFor: '`FormsModule` in `imports`, and the one signal both inputs share.',
      },
    ],
  },

  templateRefs: {
    label: 'Template refs',
    question: 'use an element of the template from elsewhere in it',
    use: '`#name`',
    why: 'Sometimes a button needs something from another element: the text of an input, or its `focus()` method. `#name` gives that element a name you can use anywhere in the template, with no code in the class.',
    steps: [
      {
        action: 'Type a name and click "Greet".',
        result:
          'The greeting appears. The button passed `nameInput.value` to the class, so the class never touches the DOM.',
      },
      {
        action: 'Click "Focus the input".',
        result:
          'The cursor jumps into the input: the template called a method of the element directly.',
      },
      {
        action: 'Type more letters and watch the `nameInput.value` row.',
        result:
          'It does not change until you click a button. Typing fires no Angular event here, so nothing re-renders the view.',
      },
    ],
    snippet: `<input #nameInput />
<button (click)="greet(nameInput.value)">Greet</button>   read a property
<button (click)="nameInput.focus()">Focus</button>          call a method`,
    read: [
      {
        file: 'demos/template-refs-demo.html',
        lookFor: '[1] the declaration, [2] and [3] two ways to use it, [4] the gotcha.',
      },
      {
        file: 'demos/template-refs-demo.ts',
        lookFor: 'The class receives a plain string, which keeps it easy to test.',
      },
    ],
  },

  let: {
    label: '@let',
    question: 'give a name to a value inside the template',
    use: '`@let`',
    why: 'A template often uses the same value in several places, or needs the result of the `async` pipe more than once. `@let` gives that value a name inside the template.',
    steps: [
      {
        action: 'Wait a second and a half.',
        result:
          'The customer appears. `@let customer = customer$ | async` subscribes once; until the first value arrives it is `null`, hence "Loading…".',
      },
      {
        action: 'Click "+ 1" until the subtotal reaches 50.',
        result:
          'Shipping becomes "Free (50 or more)". `subtotal`, `shipping` and `total` are recalculated in order, each one from the previous one.',
      },
      {
        action: 'Click "− 1".',
        result:
          'Shipping comes back. A `@let` is read-only: it only changes because `quantity()` changed.',
      },
    ],
    snippet: `@let subtotal = quantity() * unitPrice;
@let shipping = subtotal >= 50 ? 0 : 4.99;
@let customer = customer$ | async;

<p>{{ customer?.name }}: {{ subtotal + shipping | currency }}</p>`,
    read: [
      {
        file: 'demos/let-demo.html',
        lookFor: '[1] three values that build on each other, [2] the subscription.',
      },
      {
        file: 'demos/let-demo.ts',
        lookFor: 'The data: a signal, a constant, and an Observable that arrives late.',
      },
    ],
  },

  pipes: {
    label: 'Pipes',
    question: 'format a value for display (dates, money, text case)',
    use: '`value | pipe: arg`',
    why: 'The class keeps raw values: a `Date`, a number. How they look (15 Jan 2026, €1,234.50) is a display concern. Pipes transform a value for the template only.',
    steps: [
      {
        action: 'Compare the three date rows.',
        result:
          'The same `launch` date: with no argument, with a named format, and with a custom pattern.',
      },
      {
        action: 'Compare the three currency rows.',
        result:
          'The default (USD, from the `en-US` locale), then arguments after colons: the currency, then how to show it.',
      },
      {
        action: 'Watch the "async | date" row.',
        result:
          'It ticks every second: `async` unwraps the Observable, then `date` formats the result. Pipes chain from left to right.',
      },
    ],
    snippet: `{{ launch | date: 'fullDate' }}
{{ price | currency: 'EUR' : 'code' }}       arguments after colons
{{ clock$ | async | date: 'HH:mm:ss' }}     chained, left to right

// class: each pipe is imported where it is used
imports: [DatePipe, CurrencyPipe, AsyncPipe],`,
    read: [
      {
        file: 'demos/pipes-demo.html',
        lookFor: 'One row per pipe; the comments list the formats.',
      },
      {
        file: 'demos/pipes-demo.ts',
        lookFor: '[1] the pipes in `imports`, [2] the raw values they format.',
      },
    ],
  },

  encapsulation: {
    label: 'Styles',
    question: 'style a component without affecting the rest of the page',
    use: '`styles`, `ViewEncapsulation`',
    why: "Two components can use the same class name, like `.title`, without clashing: Angular scopes each component's styles to its own template. `encapsulation` decides how strict that scope is.",
    steps: [
      {
        action: 'Compare the Emulated sample with the parent paragraph below.',
        result:
          'Same class, `enc-sample`, but only the sample gets its style: Emulated rewrites the rule so it only matches its own elements.',
      },
      {
        action: 'Tick the checkbox.',
        result:
          'The None sample appears, and its rule reaches every `.enc-sample` on the page, the parent included: None makes the styles global.',
      },
      {
        action: 'Untick it.',
        result:
          'The leaked style is gone everywhere: Angular removes the styles when the last None component is destroyed.',
      },
      {
        action: 'Compare the three buttons.',
        result:
          'The ShadowDom one looks plain: the global `styles.scss` cannot enter a shadow root.',
      },
    ],
    snippet: `@Component({
  selector: 'app-card',
  template: '<p class="title">...</p>',
  styles: '.title { color: red; }',              only matches this template's .title
  encapsulation: ViewEncapsulation.Emulated,     the default: you rarely write it
})`,
    read: [
      {
        file: 'demos/encapsulation-demo.html',
        lookFor: 'Three samples with the same class, and a paragraph of the parent to compare.',
      },
      { file: 'demos/encapsulation/emulated-sample.ts', lookFor: 'The default: scoped styles.' },
      { file: 'demos/encapsulation/none-sample.ts', lookFor: 'Global styles: the leak.' },
      { file: 'demos/encapsulation/shadow-sample.ts', lookFor: 'A real shadow root.' },
    ],
  },
} as const satisfies Record<string, Guide>;
