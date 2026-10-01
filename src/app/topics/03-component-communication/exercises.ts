import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  inputs: {
    files: ['demos/inputs/progress-bar.ts', 'demos/inputs-demo.html'],
    tasks: [
      {
        task: 'Add an optional `color` input to ProgressBar (default `var(--color-accent)`), bind it to the fill with `[style.background-color]`, and pass `color="seagreen"` to the "Steps" bar.',
        expect: 'The Steps bar turns green; the other two keep the default colour.',
        solution: `// progress-bar.ts
readonly color = input('var(--color-accent)');

<!-- template of progress-bar.ts, on .fill -->
[style.background-color]="color()"

<!-- inputs-demo.html -->
<app-progress-bar value="3" max="4" striped caption="Steps" color="seagreen" />`,
      },
      {
        task: 'Predict first, then try: remove `value="40"` from the last bar.',
        expect:
          'The build fails with NG8008 "Required input \'value\' from component ProgressBar must be specified".',
        solution: `<app-progress-bar value="40" />`,
      },
      {
        task: 'Predict first, then try: remove `{ transform: booleanAttribute }` from the `striped` input.',
        expect:
          "The build fails with TS2322 \"Type 'string' is not assignable to type 'boolean'\" on the bare `striped` attribute: without the transform it passes the string ''.",
        solution: `readonly striped = input(false, { transform: booleanAttribute });`,
      },
    ],
  },

  linked: {
    files: ['demos/linked-demo.ts', 'demos/linked/option-picker.ts'],
    tasks: [
      {
        task: "Add a `kids` category with sizes `['XS', 'S', 'M']`. Then make the picker keep the selection when the new options still contain it, with the long form of linkedSignal (`source` + `computation`).",
        expect:
          'Pick M in shirts, switch to kids: M stays selected. Switch to shoes: it falls back to 38.',
        solution: `// linked-demo.ts
kids: ['XS', 'S', 'M'],

// option-picker.ts
protected readonly selected = linkedSignal<readonly string[], string>({
  source: this.options,
  computation: (options, previous) =>
    previous && options.includes(previous.value) ? previous.value : options[0],
});`,
      },
      {
        task: 'Predict first, then try: replace the linkedSignal with `signal(this.options()[0])` (import `signal`).',
        expect:
          'The build fails with NG8118 "`options` is a required `input` and does not have a value in this context": required inputs are only set after the class fields run.',
        solution: `protected readonly selected = linkedSignal(() => this.options()[0]);`,
      },
    ],
  },

  outputs: {
    files: ['demos/outputs/star-rating.ts', 'demos/outputs-demo.ts', 'demos/outputs-demo.html'],
    tasks: [
      {
        task: 'Add a `hovered` output that emits the star number on `(mouseenter)`, and show "Hovering: n" in the parent.',
        expect: 'Moving over the stars updates the parent text without changing the rating.',
        solution: `// star-rating.ts
readonly hovered = output<number>();
<!-- on each star button --> (mouseenter)="hovered.emit(star)"

// outputs-demo.ts
protected readonly hovering = signal(0);

<!-- outputs-demo.html -->
<app-star-rating ... (hovered)="hovering.set($event)" />
<p>Hovering: {{ hovering() }}</p>`,
      },
      {
        task: 'Predict first, then try: remove `(cleared)="onCleared()"` from the parent and click Clear.',
        expect:
          'Nothing happens and there is no error: emitting an output nobody listens to is fine. The rating stays, because only the parent can change it.',
        solution: `<app-star-rating [value]="rating()" (rated)="onRated($event)" (cleared)="onCleared()" />`,
      },
    ],
  },

  model: {
    files: ['demos/model-demo.html', 'demos/model/quantity-stepper.ts'],
    tasks: [
      {
        task: 'Add a third stepper bound with the long form: `[value]="quantity()" (valueChange)="quantity.set($event)"`.',
        expect:
          'It behaves exactly like the two-way one: all three change together, except the one-way stepper.',
        solution: `<app-quantity-stepper [value]="quantity()" (valueChange)="quantity.set($event)" [max]="5" />`,
      },
      {
        task: 'Give the stepper a `step` input (default 1) and use it in `step()`. Pass `[step]="2"` to the two-way stepper.',
        expect: 'The two-way stepper jumps by 2 (and stops at the max button state).',
        solution: `// quantity-stepper.ts
readonly step = input(1);
// rename the method to avoid the clash, e.g. move(delta):
protected move(direction: number): void {
  this.value.update((current) => current + direction * this.step());
}
<!-- (click)="move(-1)" / (click)="move(1)" -->`,
      },
    ],
  },

  projection: {
    files: ['demos/projection/panel.html', 'demos/projection-demo.html'],
    tasks: [
      {
        task: 'Add a badge slot to the panel header: `<ng-content select="[panel-badge]" />`, and project `<span panel-badge>New</span>` into the first panel.',
        expect: '"New" appears in the header of the first panel only.',
        solution: `<!-- panel.html, inside the header -->
<ng-content select="h3, [panel-title]" />
<ng-content select="[panel-badge]" />

<!-- projection-demo.html, in the first <app-panel> -->
<span panel-badge>New</span>`,
      },
      {
        task: 'Predict first, then try: wrap the `<h3>` of the first panel in a `<div>`.',
        expect:
          'The title moves into the body: `select` only matches the top-level nodes the parent projects, and the `<div>` does not match `h3`.',
        solution: `<!-- Mark the wrapper instead: <div panel-title><h3>All three slots</h3></div> -->`,
      },
      {
        task: 'Give `<app-callout>` fallback content (`<ng-content>Nothing to say.</ng-content>`) and add an empty `<app-callout />` to the demo.',
        expect:
          'The empty callout shows "Nothing to say."; the existing one still shows its content.',
        solution: `<!-- callout.ts template -->
<div class="content"><ng-content>Nothing to say.</ng-content></div>

<!-- projection-demo.html -->
<app-callout />`,
      },
    ],
  },

  queries: {
    files: ['demos/queries-demo.ts', 'demos/queries-demo.html', 'demos/queries/labeled-field.ts'],
    tasks: [
      {
        task: 'Add a "Start first" button that starts only the first stopwatch, using a new `viewChild(Stopwatch)` query.',
        expect:
          'Only Lane 1 starts. `viewChild` returns the first match; it is `undefined` when there is none, hence the `?.`.',
        solution: `// queries-demo.ts
private readonly firstStopwatch = viewChild(Stopwatch);
protected startFirst(): void {
  this.firstStopwatch()?.start();
}

<!-- queries-demo.html -->
<button type="button" (click)="startFirst()">Start first</button>`,
      },
      {
        task: 'Add a "Clear search" button next to "Focus the input" that empties the search box through the existing `search` query.',
        expect: 'The search box empties.',
        solution: `protected clearSearch(): void {
  this.search().nativeElement.value = '';
}`,
      },
      {
        task: 'Predict first, then try: in `labeled-field.ts`, change `contentChild.required` to `viewChild.required`.',
        expect:
          'It compiles, but the console shows NG0951 "Child query result is required but no value is available": the input is projected content, not part of the field\'s own template.',
        solution: `private readonly control = contentChild.required<ElementRef<HTMLInputElement>>('control');`,
      },
    ],
  },

  tree: {
    files: ['demos/tree/task-item.ts', 'demos/tree/task-list.ts', 'demos/tree-demo.ts'],
    tasks: [
      {
        task: 'Add a "Remove" button to each task. The item emits a `removed` output, the list forwards it, and the parent removes the task.',
        expect:
          'The task disappears and "Remaining" updates. Count how many files one event needed: that plumbing is why services exist.',
        solution: `// task-item.ts
readonly removed = output<number>();
<button type="button" (click)="removed.emit(task().id)">Remove</button>

// task-list.ts
readonly removed = output<number>();
<app-task-item ... (removed)="removed.emit($event)" />

// tree-demo.html: (removed)="onRemoved($event)" on both lists
// tree-demo.ts
protected onRemoved(id: number): void {
  this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
}`,
      },
      {
        task: 'Predict first, then try: in `task-list.ts`, delete `(toggled)="toggled.emit($event)"`, then click a checkbox.',
        expect:
          'The checkbox ticks (the browser does that by itself), but the text is not crossed out and "Remaining" does not change: the event never reaches the owner of the state. Outputs do not bubble.',
        solution: `<app-task-item [task]="task" (toggled)="toggled.emit($event)" />`,
      },
    ],
  },

  siblings: {
    files: [
      'demos/siblings/cart-store.ts',
      'demos/siblings/cart-summary.ts',
      'demos/siblings-demo.ts',
    ],
    tasks: [
      {
        task: 'Add a `removeOne(productId)` method to CartStore and a "−" button per line in the cart summary.',
        expect:
          'The quantity goes down by one, and the line disappears at 0. The picker never knew.',
        solution: `// cart-store.ts
removeOne(productId: number): void {
  this.cartLines.update((lines) =>
    lines
      .map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line))
      .filter((line) => line.quantity > 0),
  );
}

<!-- cart-summary.ts, in each <li> -->
<button type="button" (click)="store.removeOne(line.product.id)">−</button>`,
      },
      {
        task: 'Predict first, then try: delete `providers: [CartStore]` from `siblings-demo.ts` and reload the page.',
        expect:
          'The topic does not open: the console shows NG0201 "No provider found for CartStore" and the navigation is cancelled. `@Injectable()` without `providedIn` must be provided somewhere.',
        solution: `providers: [CartStore],   // or @Injectable({ providedIn: 'root' }) in cart-store.ts`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
