import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  if: {
    files: ['demos/if-demo.html'],
    tasks: [
      {
        task: 'Add a "B+" grade for scores of 80 or more. Where does the new `@else if` have to go?',
        expect:
          'A score of 85 shows B+, 75 still shows B. It must come before `>= 70`: the first true condition wins.',
        solution: `} @else if (score() >= 80) {
  <strong>B+</strong>: very good
} @else if (score() >= 70) {`,
      },
      {
        task: 'Below the user paragraph, show "Admin tools" only when the selected user is an admin.',
        expect: 'The line appears for Ada and disappears for Linus, Grace and None.',
        solution: `@if (selectedUser()?.role === 'admin') {
  <p>Admin tools</p>
}`,
      },
      {
        task: 'Predict first, then try: add `@if (selectedUser()) { <p>{{ selectedUser().name }}</p> }`.',
        expect:
          'The build fails with TS2532 "Object is possibly \'undefined\'": the type checker does not narrow a second call of the signal. `; as user` stores the checked value.',
        solution: `@if (selectedUser(); as user) {
  <p>{{ user.name }}</p>
}`,
      },
    ],
  },

  for: {
    files: ['demos/for-demo.html', 'demos/for-demo.ts'],
    tasks: [
      {
        task: 'Rename two implicit variables in one go: `let i = $index, n = $count`, and use them for the position text.',
        expect: 'The rows still read "1 / 3", "2 / 3"…',
        solution: `@for (task of tasks(); track task.id; let i = $index, n = $count) {
  <li [class.is-odd]="$odd">
    <span class="position">{{ i + 1 }} / {{ n }}</span>`,
      },
      {
        task: 'Add a "Move up" button to each row, hidden on the first one. Pass `$index` to a new method.',
        expect:
          'The task swaps places with the one above it. `$first` hides the button on the top row.',
        solution: `<!-- for-demo.html, inside the <li> -->
@if (!$first) {
  <button type="button" (click)="moveUp($index)">Move up</button>
}

// for-demo.ts
protected moveUp(index: number): void {
  this.tasks.update((tasks) => {
    const next = [...tasks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    return next;
  });
}`,
      },
      {
        task: 'Predict first, then try: delete `track task.id;` from the `@for`.',
        expect: 'The build fails with NG5002 "@for loop must have a \\"track\\" expression".',
        solution: `@for (task of tasks(); track task.id; let pos = $index) {`,
      },
    ],
  },

  track: {
    files: ['demos/track-demo.html'],
    tasks: [
      {
        task: 'Predict first: type a note in every input of the three columns, then click Reverse. Which notes travel with their fruit?',
        expect:
          'In `track fruit.id` and `track fruit` the rows move with the fruit, notes included. In `track $index` the rows stay in place and only the names change, so the notes now sit next to other fruits.',
        solution: `No code: the row (and its DOM input) belongs to the key.
Same key after the change = same row, moved if needed.`,
      },
      {
        task: 'Predict first: click "Reload (new objects)". Which column gets new #numbers?',
        expect:
          'Only `track fruit`: every object is new, so every key is new and all rows are recreated (notes lost). The other two keep their rows.',
        solution: `No code. This is why tracking by object identity is a bad idea for data that is
fetched again: use a stable id.`,
      },
      {
        task: 'Change the first column to `track fruit.name`, then click "Add to top" 5 times, until Apple appears twice. Open the browser console.',
        expect:
          'Warning NG0955 "The provided track expression resulted in duplicated keys": the rows still render, but Angular cannot tell the two Apple rows apart. Keys must be unique.',
        solution: `@for (fruit of fruits(); track fruit.name) {   <!-- not unique: use fruit.id -->`,
      },
    ],
  },

  switch: {
    files: ['demos/switch-demo.ts', 'demos/switch-demo.html'],
    tasks: [
      {
        task: "Add a `'student'` plan to the `Plan` type and to `plans`, and save without touching the template.",
        expect:
          'The build fails with TS2322 "Type \'\\"student\\"\' is not assignable to type \'never\'": `@default never` makes the switch exhaustive. Add the missing `@case`.',
        solution: `// switch-demo.ts
type Plan = 'free' | 'pro' | 'team' | 'enterprise' | 'student';
protected readonly plans: readonly Plan[] = ['free', 'pro', 'team', 'enterprise', 'student'];

<!-- switch-demo.html -->
@case ('student') {
  Student: free Pro features while you study.
}`,
      },
      {
        task: 'Handle the 418 status, which currently falls into `@default`.',
        expect: 'Choosing 418 shows your text instead of "Unexpected status 418".',
        solution: `@case (418) {
  I'm a teapot.
}`,
      },
    ],
  },

  defer: {
    files: ['demos/defer-demo.html'],
    tasks: [
      {
        task: 'Add a fifth section with `@defer (on hover)` and a placeholder that says "Hover me".',
        expect: 'The widget appears when the mouse goes over the placeholder.',
        solution: `<section>
  <h3><code>on hover</code></h3>
  @defer (on hover) {
    <app-heavy-widget trigger="on hover" />
  } @placeholder {
    <p class="state">Hover me</p>
  }
</section>`,
      },
      {
        task: 'Give the `when ready()` block a second trigger: `@defer (when ready(); on timer(10s))`.',
        expect:
          'It loads when you tick ready() or after 10 seconds, whichever comes first. Click Replay to try both.',
        solution: `@defer (when ready(); on timer(10s)) {`,
      },
      {
        task: 'Predict first, then try: add `<app-heavy-widget trigger="eager" />` outside every @defer block, and run `npm run build`.',
        expect:
          'The lazy chunk named `heavy-widget` is gone from the build output: a component used outside @defer anywhere in the template is loaded eagerly, for every block.',
        solution: `<!-- Remove the eager use: a deferred component must only appear inside @defer blocks. -->`,
      },
    ],
  },

  legacy: {
    files: ['demos/legacy-demo.ts', 'demos/legacy-demo.html'],
    tasks: [
      {
        task: 'Predict first, then try: remove `NgIf` from the component `imports` (and from the import line).',
        expect:
          'It still compiles, with warning NG8103. On the page, neither "Welcome back!" nor "Please sign in." shows in the left column: without the directive nobody renders the template. The console shows NG0303 "Can\'t bind to \'ngIf\'".',
        solution: `imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],`,
      },
      {
        task: 'Let the migration do the work: run `npx ng g @angular/core:control-flow --path src/app/topics/02-control-flow/demos` and read the diff of `legacy-demo.html`.',
        expect:
          'The left column now uses @if, @for and @switch, and the directive imports are gone (`imports: []`). Note how it kept `trackBy`: `track trackById(i, item)`. Simplify it to `track item.id`.',
        solution: `npx ng g @angular/core:control-flow --path src/app/topics/02-control-flow/demos
git diff src/app/topics/02-control-flow/demos/legacy-demo.html`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
