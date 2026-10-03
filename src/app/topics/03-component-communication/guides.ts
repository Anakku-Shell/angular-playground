import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs.
 * `[1]`, `[2]`... in `lookFor` match numbered comments in those files.
 */
export const GUIDES = {
  inputs: {
    label: 'input()',
    question: 'pass data from a parent to a child',
    use: '`input()`',
    why: 'A component is only reusable if its parent can configure it: the same progress bar can show an upload, the steps of a wizard or anything else. Inputs are the parameters of a component, like the arguments of a function.',
    steps: [
      {
        action: 'Move the "Uploaded" slider.',
        result:
          'Only the first bar follows it. The slider changes the parent\'s `uploaded` signal, and `[value]="uploaded()"` sends the new number down to that bar.',
      },
      {
        action: 'Tick "striped".',
        result:
          'The first bar gets stripes. That is a second input, `[striped]`, bound to another signal of the parent.',
      },
      {
        action: 'Look at the second bar, "Steps".',
        result:
          'Its values are written in the HTML: `value="3" max="4" striped`. Static attributes always arrive as strings, so the child converts them with transforms.',
      },
      {
        action: 'Look at the third bar.',
        result:
          'The parent only sets `value`. `max` and the caption use the defaults declared in the child: 100 and "Progress".',
      },
    ],
    snippet: `<!-- parent template -->
<app-progress-bar [value]="uploaded()" [max]="250" />

// child class
readonly value = input.required<number>();   // the parent must set it
readonly max = input(100);                    // optional, 100 by default

<!-- child template: inputs are signals, read them with () -->
{{ value() }} / {{ max() }}`,
    read: [
      {
        file: 'demos/inputs-demo.html',
        lookFor: 'The parent: three bars, given their inputs in three ways, [1] to [3].',
      },
      {
        file: 'demos/inputs-demo.ts',
        lookFor: 'The two signals of the parent that the first bar receives.',
      },
      {
        file: 'demos/inputs/progress-bar.ts',
        lookFor:
          'The child: [1] the inputs it declares, [2] the transforms, [3] a value derived from them with `computed()`.',
      },
    ],
  },

  linked: {
    label: 'linkedSignal()',
    question: 'keep child state that starts from an input and resets with it',
    use: '`linkedSignal()`',
    why: 'Sometimes a child needs its own state that starts from an input. A size picker receives the list of sizes but remembers the one you clicked. When the parent sends another list, the old choice makes no sense and has to reset.',
    steps: [
      {
        action: 'Click size L.',
        result:
          'The picker stores your choice in its own state. The parent knows nothing about it.',
      },
      {
        action: 'Change the category to "shoes".',
        result:
          'The parent sends a new `options` list and the selection jumps to 38 by itself: the `linkedSignal` recomputed from the new input.',
      },
      {
        action: 'Pick 41, then go back to "shirts".',
        result:
          'It resets again, to XS. You can `set()` a `linkedSignal` like any signal, and it starts over each time its source changes.',
      },
    ],
    snippet: `// child class
readonly options = input.required<string[]>();

// writable, and back to the first option whenever options() changes
selected = linkedSignal(() => this.options()[0]);

// read-only, derived from the other two
summary = computed(() => \`\${this.selected()} of \${this.options().length}\`);

<!-- child template -->
<button (click)="selected.set(option)">{{ option }}</button>`,
    read: [
      {
        file: 'demos/linked-demo.ts',
        lookFor: 'The parent: a `category` signal and the `sizes` derived from it.',
      },
      {
        file: 'demos/linked-demo.html',
        lookFor: 'The parent passes `sizes()` to the picker as `[options]`.',
      },
      {
        file: 'demos/linked/option-picker.ts',
        lookFor:
          'The child: [1] the input, [2] its local state with `linkedSignal`, [3] a read-only `computed`.',
      },
    ],
  },

  outputs: {
    label: 'output()',
    question: 'tell the parent that something happened',
    use: '`output()`',
    why: 'Inputs only travel down. When something happens inside the child, like a click on a star, the parent has to hear about it, because the parent owns the data. Outputs are the custom events of a component.',
    steps: [
      {
        action: 'Click the fourth star.',
        result:
          'The parent\'s `rating()` becomes 4 and the event shows up in the log. The child changed nothing: it only announced "someone rated 4", and the parent stored it.',
      },
      {
        action: 'Look at the stars again.',
        result:
          'Four of them are filled because the parent sent the new rating back down as an input. One click is one trip up (the output) and one trip down (the input).',
      },
      {
        action: 'Click "Clear".',
        result:
          'A second output, `cleared`, without a payload. The parent sets the rating back to 0.',
      },
    ],
    snippet: `// child class
readonly rated = output<number>();

<!-- child template: fire the event -->
<button (click)="rated.emit(4)">★</button>

<!-- parent template: listen like a DOM event; $event is the 4 -->
<app-star-rating [value]="rating()" (rated)="rating.set($event)" />`,
    read: [
      {
        file: 'demos/outputs/star-rating.ts',
        lookFor:
          'The child: [1] the input it only displays, [2] the outputs, [3] the place where it emits them.',
      },
      {
        file: 'demos/outputs-demo.html',
        lookFor: 'The parent listens with `(rated)` and `(cleared)`, the same syntax as `(click)`.',
      },
      {
        file: 'demos/outputs-demo.ts',
        lookFor: "The handlers, which update the parent's state.",
      },
    ],
  },

  model: {
    label: 'model()',
    question: 'let a form-like child edit a value of the parent',
    use: '`model()`',
    why: 'Some children are form controls. A quantity stepper should change the number by itself, without the parent writing a handler for every click. `model()` lets the child write back into a value of the parent: two-way binding, as `ngModel` does for an `<input>`.',
    steps: [
      {
        action: 'Click + on the two-way stepper.',
        result:
          "The stepper and `quantity()` in the parent change together. The one-way stepper follows too, because it receives the parent's value.",
      },
      {
        action: 'Click + on the one-way stepper.',
        result:
          'Only that stepper changes. Its binding goes from parent to child only, so the parent never hears about it.',
      },
      {
        action: 'Click + on the two-way stepper again.',
        result:
          "The one-way stepper is back in line: the parent's new value overwrote its local change.",
      },
      {
        action:
          'Click "Parent: set to 1", then + on the one-way stepper, then "Parent: set to 1" again.',
        result:
          'The second click does nothing to the one-way stepper. The parent already holds 1, and setting a signal to the value it has does not notify anyone, so the input is not sent again.',
      },
    ],
    snippet: `// child class
readonly value = model(1);
this.value.update((n) => n + 1);   // changes it here AND emits valueChange

<!-- parent template -->
<app-quantity-stepper [(value)]="quantity" />   two-way: pass the signal, no ()
<app-quantity-stepper [value]="quantity()" />   one-way: pass its value`,
    read: [
      {
        file: 'demos/model/quantity-stepper.ts',
        lookFor: 'The child: [1] `model()`, [2] the method that writes to it.',
      },
      {
        file: 'demos/model-demo.html',
        lookFor: 'The parent: the same child bound two-way [1] and one-way [2], side by side.',
      },
      {
        file: 'demos/model-demo.ts',
        lookFor: 'A single signal, `quantity`, behind both steppers.',
      },
    ],
  },

  projection: {
    label: 'ng-content',
    question: 'pass markup instead of data',
    use: '`<ng-content>`',
    why: "Inputs pass data. Sometimes the parent wants to pass markup instead: a card, a dialog or a panel frames content that only the parent knows. With content projection the parent writes HTML between the child's tags, and the child decides where it goes.",
    steps: [
      {
        action: 'Read the callout at the top of the demo.',
        result:
          'The parent wrote that text between `<app-callout>` and `</app-callout>`. The callout only draws the frame: the icon and the box.',
      },
      {
        action: 'Click "Save" in the first panel.',
        result:
          "The counter in the callout goes up. Projected content belongs to the parent, so its bindings and click handlers use the parent's state.",
      },
      {
        action: 'Compare the three panels.',
        result:
          'One component, three layouts: title, body and footer go to separate slots. The second panel has no footer, so that slot shows its fallback text.',
      },
      {
        action: 'Look at the frame of this card.',
        result:
          'This page uses it too: every card is an `<app-demo-card>` with a slot for the title, one for the demo and a default one for the rest.',
      },
    ],
    snippet: `<!-- child template (panel.html) -->
<header><ng-content select="h3" /></header>
<ng-content />                                   the default slot: everything else
<footer><ng-content select="[panel-footer]">No actions</ng-content></footer>

<!-- parent template -->
<app-panel>
  <h3>Title</h3>
  <p>Body</p>
  <button panel-footer>Save</button>
</app-panel>`,
    read: [
      {
        file: 'demos/projection/callout.ts',
        lookFor: 'The simplest case: a single `<ng-content />`.',
      },
      {
        file: 'demos/projection/panel.html',
        lookFor: 'Three slots, [1] to [3]; the last one has fallback content.',
      },
      {
        file: 'demos/projection-demo.html',
        lookFor:
          'The parent filling them, [1] to [3]. The third panel uses `ngProjectAs` to send two buttons to the footer.',
      },
    ],
  },

  queries: {
    label: 'Queries',
    question: "call a child's method or touch the DOM",
    use: '`viewChild()`, `viewChildren()`, `contentChild()`',
    why: 'Inputs and outputs cover data and events. Sometimes a component has to act on something in its template directly: focus an input, measure an element, or call a method of a child such as a stopwatch. Queries give the class a reference to it.',
    steps: [
      {
        action: 'Click "Focus the input".',
        result:
          "The cursor jumps into the search box. The class found `<input #search>` with `viewChild('search')` and called the DOM method `focus()`.",
      },
      {
        action: 'Click "Start all".',
        result:
          'Every stopwatch starts. `viewChildren(Stopwatch)` returns all of them, and the parent calls `start()` on each.',
      },
      {
        action: 'Click "Add lane" while they run, then "Start all" again.',
        result:
          'The new lane starts too: the query is a signal and updates when `@for` adds a stopwatch. "Running: X of Y" is a `computed()` over it.',
      },
      {
        action: 'Type in the Email field, then click "Clear".',
        result:
          "The field is emptied and focused. The parent projected that `<input>`, so the field finds it with `contentChild()`: `viewChild()` only sees the component's own template.",
      },
    ],
    snippet: `<!-- template -->
<input #search />
<app-stopwatch />

// class
search = viewChild.required<ElementRef<HTMLInputElement>>('search');   // by #name
watches = viewChildren(Stopwatch);                                      // by type

// queries are signals: call them to get the result
focusSearch() { this.search().nativeElement.focus(); }
startAll()    { this.watches().forEach((watch) => watch.start()); }`,
    read: [
      {
        file: 'demos/queries-demo.html',
        lookFor: 'The three blocks and the `#search` and `#control` references.',
      },
      {
        file: 'demos/queries-demo.ts',
        lookFor: '[1] `viewChild`, [2] `viewChildren`, [3] the methods that use them.',
      },
      {
        file: 'demos/queries/stopwatch.ts',
        lookFor:
          'The public API the parent calls: `start()`, `stop()`, `reset()` and two read-only signals.',
      },
      {
        file: 'demos/queries/labeled-field.ts',
        lookFor: '`contentChild` finding the `#control` projected by the parent.',
      },
    ],
  },

  tree: {
    label: 'Grandchildren',
    question: 'go through several levels',
    use: 'an input and an output at each level',
    why: 'Real pages are trees, not pairs. With inputs and outputs, data travels one level at a time: down through every component in between, and events back up through each of them. This card shows the whole round trip across three levels.',
    steps: [
      {
        action: 'Tick "Write a component".',
        result:
          '"Last event path" shows the trip up: the item emitted the event, the list emitted it again, and the page updated its signal.',
      },
      {
        action: 'Look at the counters.',
        result:
          '"(2/3)" in the list and "Remaining" in the page changed: the new array travelled back down through every level.',
      },
      {
        action: 'Read the diagram above the lists.',
        result:
          'Every level declares its own input and output. The middle list does nothing with the event but pass it on: this is called "prop drilling".',
      },
    ],
    snippet: `<!-- app-tree-demo: owns the tasks -->
<app-task-list [tasks]="workTasks()" (toggled)="onToggled($event)" />

<!-- app-task-list: passes both on -->
<app-task-item [task]="task" (toggled)="toggled.emit($event)" />

<!-- app-task-item: displays one task, reports the click -->
<input type="checkbox" (change)="toggled.emit(task().id)" />`,
    read: [
      {
        file: 'demos/tree/task-item.ts',
        lookFor: 'The grandchild: shows one task and emits its id.',
      },
      {
        file: 'demos/tree/task-list.ts',
        lookFor: 'The middle level: [1] receives the tasks, [2] forwards each event.',
      },
      {
        file: 'demos/tree-demo.ts',
        lookFor: 'The parent: the only place that changes the tasks, with an immutable update.',
      },
    ],
  },

  siblings: {
    label: 'Siblings',
    question: 'share state between components that are not parent and child',
    use: 'a service, with `inject()`',
    why: 'Two components side by side, a product list and a cart, have no parent-child link, so they cannot bind to each other. Instead of routing everything through their parent, both inject the same service, and the service holds the shared state.',
    steps: [
      {
        action: 'Click "Add" on Keyboard twice.',
        result:
          'The cart shows "2 × Keyboard". The picker called `store.add()`, and the summary reads the same store, so it updated by itself.',
      },
      {
        action: 'Click "Clear" in the cart.',
        result:
          'The cart is empty again. Neither component has inputs or outputs: the store is their only link.',
      },
      {
        action: 'Add something, open another topic, and come back.',
        result:
          'The cart is empty. The demo component provides the store, so the store is created and destroyed with it.',
      },
    ],
    snippet: `// the shared service
@Injectable()
export class CartStore {
  private readonly lines = signal<CartLine[]>([]);
  readonly count = computed(() => this.lines().length);
  add(product: Product) { this.lines.update(/* ... */); }
}

// in both siblings
protected readonly store = inject(CartStore);

// the common parent creates ONE instance for both
@Component({ providers: [CartStore] })`,
    read: [
      {
        file: 'demos/siblings/cart-store.ts',
        lookFor:
          'The shared state: [1] a private writable signal, [2] public read-only values, [3] methods.',
      },
      {
        file: 'demos/siblings/product-picker.ts',
        lookFor: 'Sibling 1 writes: `store.add(product)`.',
      },
      {
        file: 'demos/siblings/cart-summary.ts',
        lookFor: 'Sibling 2 reads: `store.count()`, `store.lines()`, `store.total()`.',
      },
      {
        file: 'demos/siblings-demo.ts',
        lookFor: '`providers: [CartStore]`, the line that gives both the same instance.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
