import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  if: {
    label: '@if',
    question: 'show or remove part of the template',
    use: '`@if` / `@else if` / `@else`',
    why: 'A view changes with its data: the grade depends on the score, a panel only exists while a user is selected. `@if` adds or removes a piece of the template depending on a condition.',
    steps: [
      {
        action: 'Move the Score slider from 100 down to 0.',
        result:
          'The grade goes A, B, C, F. The conditions are checked from top to bottom, and the first true one wins.',
      },
      {
        action: 'Pick Ada in the User list.',
        result:
          'Her name and role appear. `@if (selectedUser(); as user)` stores the checked value, so the block can use `user.name` safely.',
      },
      {
        action: 'Pick None.',
        result:
          'The `@else` block shows "No user selected.". The user block was destroyed, not hidden.',
      },
    ],
    snippet: `@if (score() >= 90) {
  <strong>A</strong>
} @else if (score() >= 50) {
  <strong>Pass</strong>
} @else {
  <strong>F</strong>
}

@if (selectedUser(); as user) {
  <p>{{ user.name }}</p>      here user is a User, not User | undefined
}`,
    read: [
      {
        file: 'demos/if-demo.html',
        lookFor: '[1] a chain of conditions, [2] `as` to keep the checked value.',
      },
      {
        file: 'demos/if-demo.ts',
        lookFor: '`selectedUser`, a `computed()` that can be `undefined`.',
      },
    ],
  },

  for: {
    label: '@for',
    question: 'repeat a piece of the template for each item of a list',
    use: '`@for` + `@empty`',
    why: 'Lists are everywhere: tasks, products, messages. `@for` repeats a block once per item, gives you its position and a few other helpers, and `@empty` covers the empty list.',
    steps: [
      {
        action: 'Click "Add task" twice.',
        result:
          'Two rows appear at the end, and every "x / n" counter updates: `$count` is the length of the list.',
      },
      {
        action: 'Look at the badges and the shaded rows.',
        result:
          '`$first` and `$last` mark the ends, and `$odd` shades every other row. They are recalculated whenever the list changes.',
      },
      {
        action: 'Click "Clear", then "Reset".',
        result: 'The `@empty` block appears instead of the rows, then the tasks come back.',
      },
    ],
    snippet: `@for (task of tasks(); track task.id; let i = $index) {
  <li [class.odd]="$odd">{{ i + 1 }} / {{ $count }}: {{ task.title }}</li>
} @empty {
  <li>No tasks.</li>
}`,
    read: [
      {
        file: 'demos/for-demo.html',
        lookFor: '[1] the loop with `track` and `let`, [2] the implicit variables, [3] `@empty`.',
      },
      {
        file: 'demos/for-demo.ts',
        lookFor: 'Every change creates a new array.',
      },
    ],
  },

  track: {
    label: 'track',
    question: 'keep the right rows when a list changes',
    use: '`track item.id`',
    why: 'When a list changes, Angular has to decide which rows to keep, move, create or destroy. `track` gives each item a key. A good key keeps each row, and whatever the user typed in it, with its item.',
    steps: [
      {
        action: 'Type a note in every input of the three columns, then click "Reverse".',
        result:
          'In `track fruit.id` and `track fruit` the rows move with their fruit, notes included. In `track $index` the rows stay in place and only the names change, so the notes end up next to other fruits.',
      },
      {
        action: 'Click "Reload (new objects)".',
        result:
          'Only `track fruit` gets new #numbers: every object is new, so every key is new and every row is recreated. Its notes are lost.',
      },
      {
        action: 'Click "Reset", then "Add to top".',
        result:
          '`track fruit.id` creates one row at the top. `track $index` renames every row and creates the new one at the end.',
      },
    ],
    snippet: `@for (fruit of fruits(); track fruit.id) { ... }   a stable id: the usual choice
@for (fruit of fruits(); track $index) { ... }     the position: rows never move
@for (fruit of fruits(); track fruit) { ... }      the object: new objects, new rows`,
    read: [
      {
        file: 'demos/track-demo.html',
        lookFor: 'The same list in three columns, [1] to [3], one per kind of key.',
      },
      {
        file: 'demos/track/track-row.ts',
        lookFor: 'The #number: a new one means a new component instance.',
      },
      {
        file: 'demos/track-demo.ts',
        lookFor: 'The buttons: [1] add, [2] reverse, [3] new objects with the same data.',
      },
    ],
  },

  switch: {
    label: '@switch',
    question: 'pick one block among several values',
    use: '`@switch` / `@case`',
    why: 'When one value selects one of several views (a plan, a status code, a tab), a chain of `@else if` gets long. `@switch` compares the value with each `@case` and renders the one that matches.',
    steps: [
      {
        action: 'Click each plan.',
        result:
          'The text changes. "team" and "enterprise" share a body: a `@case` without a body uses the next one.',
      },
      {
        action: 'Pick 404 in the status list, then 418.',
        result:
          '404 has its own case. 418 has none, so `@default` renders "Unexpected status 418".',
      },
    ],
    snippet: `@switch (status()) {
  @case (200) { OK }
  @case (404) { Not found }
  @default { Unexpected status {{ status() }} }
}`,
    read: [
      {
        file: 'demos/switch-demo.html',
        lookFor:
          '[1] cases that share a body, [2] `@default never` for an exhaustive check, [3] a plain `@default`.',
      },
      {
        file: 'demos/switch-demo.ts',
        lookFor: 'The `Plan` type that makes the exhaustive check possible.',
      },
    ],
  },

  defer: {
    label: '@defer',
    question: 'load a heavy part of the page later',
    use: '`@defer (on …)`',
    why: 'Some components are heavy (a chart, an editor, a map) and not needed right away. `@defer` moves them into a separate file that is downloaded only when a trigger fires, so the page starts faster.',
    steps: [
      {
        action: 'Click "Click to load".',
        result:
          '"Loading…" shows for at least a second, then the widget. `on interaction` waited for your click.',
      },
      {
        action: 'Click "Replay" and wait three seconds.',
        result:
          'The `on timer(3s)` block loads by itself. `on idle` loaded almost at once, as soon as the browser had nothing else to do.',
      },
      {
        action: 'Tick `ready()`.',
        result:
          'The `when ready()` block loads. Unticking it does not unload it: a loaded block stays.',
      },
      {
        action: 'Scroll down inside the last box.',
        result: 'That block loads when its placeholder enters the viewport.',
      },
    ],
    snippet: `@defer (on viewport) {
  <app-heavy-chart />            its code is downloaded only now
} @placeholder {
  <p>The chart will load here.</p>
} @loading (minimum 1s) {
  <p>Loading…</p>
}`,
    read: [
      {
        file: 'demos/defer-demo.html',
        lookFor: 'One block per trigger, [1] to [5], with their optional blocks.',
      },
      {
        file: 'demos/defer/heavy-widget.ts',
        lookFor: 'The component that ends up in its own chunk.',
      },
      {
        file: 'demos/defer-demo.ts',
        lookFor: '[1] why it is in `imports` and still lazy, [2] how Replay starts over.',
      },
    ],
  },

  legacy: {
    label: 'Legacy',
    question: 'read older code that uses *ngIf, *ngFor and [ngSwitch]',
    use: '`*ngIf`, `*ngFor`, `[ngSwitch]`',
    why: 'Before v17, templates used structural directives instead of blocks. You will meet them in older projects, so this card shows both side by side, doing the same thing.',
    steps: [
      {
        action: 'Untick "Logged in".',
        result:
          'Both columns switch to "Please sign in.": `*ngIf … else` and `@if … @else` do the same.',
      },
      {
        action: 'Pick another mode.',
        result:
          'Both columns change together: `[ngSwitch]` with `*ngSwitchCase` on the left, `@switch` with `@case` on the right.',
      },
      {
        action: 'Compare the code under each column.',
        result:
          'The directives need imports and an `<ng-template>` for the else, and `trackBy` needs a function. The blocks need nothing.',
      },
    ],
    snippet: `<!-- legacy -->
<p *ngIf="loggedIn(); else out">Welcome</p>
<ng-template #out><p>Sign in</p></ng-template>
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>

<!-- built-in control flow -->
@if (loggedIn()) { <p>Welcome</p> } @else { <p>Sign in</p> }
@for (item of items; track item.id) { <li>{{ item.name }}</li> }`,
    read: [
      {
        file: 'demos/legacy-demo.html',
        lookFor: 'The two columns: [1] the directives, [2] the blocks.',
      },
      {
        file: 'demos/legacy-demo.ts',
        lookFor: '[1] the imports the legacy column needs, [2] the `trackById` function.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
