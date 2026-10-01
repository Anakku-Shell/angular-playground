import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  highlight: {
    files: ['directives/highlight.ts', 'demos/highlight-demo.ts'],
    tasks: [
      {
        task: 'Add a `bold` input (`booleanAttribute`) that makes the text bold while hovered, through a host binding. Use it as `<p appHighlight bold>`.',
        expect:
          'Only that box turns bold on hover. A bare attribute is enough thanks to the transform.',
        solution: `readonly bold = input(false, { transform: booleanAttribute });

host: {
  // ...
  '[style.fontWeight]': 'hovered() && bold() ? 700 : null',
},`,
      },
      {
        task: 'Make the highlight follow keyboard focus too: add `(focusin)` and `(focusout)` host listeners, and `tabindex="0"` on one box.',
        expect: 'Tabbing onto that box highlights it, like hovering does.',
        solution: `'(focusin)': 'hoveredState.set(true)',
'(focusout)': 'hoveredState.set(false)',`,
      },
      {
        task: 'Predict first, then try: remove `Highlight` from the demo component `imports`.',
        expect:
          "The build fails with NG8002 \"Can't bind to 'appHighlight' since it isn't a known property of 'p'\". The plain `appHighlight` attributes would not fail: they would just do nothing.",
        solution: `imports: [Highlight],`,
      },
    ],
  },

  tooltip: {
    files: ['directives/tooltip.ts'],
    tasks: [
      {
        task: 'Show the bubble only after 500 ms of hovering: start a `setTimeout` in `show()` and clear it in `hide()`.',
        expect: 'Passing quickly over a button shows nothing; resting on it shows the bubble.',
        solution: `private timer?: ReturnType<typeof setTimeout>;

protected show(): void {
  if (this.bubble || this.timer) return;
  this.timer = setTimeout(() => {
    this.timer = undefined;
    // ...the current body of show()
  }, 500);
}

protected hide(): void {
  clearTimeout(this.timer);
  this.timer = undefined;
  // ...the current body of hide()
}`,
      },
      {
        task: 'Predict first, then try: delete `this.bubble?.destroy();` from `hide()` and hover the Save button a few times.',
        expect:
          'A new bubble appears on every hover and none go away: the component created with `createComponent` lives until someone destroys it (or its container is destroyed).',
        solution: `this.bubble?.destroy();`,
      },
    ],
  },

  dropdown: {
    files: ['demos/dropdown-demo.ts', 'directives/dropdown.ts'],
    tasks: [
      {
        task: 'Show "(menu open)" in the hint paragraph below, using the same `#menu` reference.',
        expect:
          'The text appears while the menu is open: a template reference works anywhere in the template, not only inside its element.',
        solution: `@if (menu.isOpen()) {
  <span>(menu open)</span>
}`,
      },
      {
        task: 'Add an `open()` method to the directive and call it from a second button, "Open".',
        expect: 'The new button opens the menu; clicking outside closes it as before.',
        solution: `open(): void {
  this.openState.set(true);
}

<button type="button" (click)="menu.open()">Open</button>`,
      },
      {
        task: "Predict first, then try: remove `exportAs: 'appDropdown'` from the directive.",
        expect:
          'The build fails with NG8003 "No directive found with exportAs \'appDropdown\'": `#menu="appDropdown"` looks the directive up by that name.',
        solution: `exportAs: 'appDropdown',`,
      },
    ],
  },

  hostDirectives: {
    files: ['demos/host-directives-demo.ts'],
    tasks: [
      {
        task: "Expose Highlight's `defaultColor` input as `fallback` and use it on the third tag.",
        expect: 'The "standalone" tag now highlights in your color.',
        solution: `{ directive: Highlight, inputs: ['appHighlight: color', 'defaultColor: fallback'] },

<app-tag fallback="khaki" hint="...">standalone</app-tag>`,
      },
      {
        task: 'Predict first, then try: write `<app-tag [appHighlight]="\'red\'">` instead of `color="..."`.',
        expect:
          "The build fails with NG8002 \"Can't bind to 'appHighlight' since it isn't a known property of 'app-tag'\": host directive inputs are private unless listed, and here it is only exposed as `color`.",
        solution: `<app-tag color="red" hint="...">...</app-tag>`,
      },
    ],
  },

  structural: {
    files: ['directives/has-role.ts', 'demos/structural-demo.ts'],
    tasks: [
      {
        task: 'Predict first: put an `<input>` inside the editor-only box, type in it as editor, then switch to admin. Does the text survive?',
        expect:
          'Yes: `allowed()` stays true, the computed does not notify, and the view is not recreated. Switch to guest and back and the text is gone.',
        solution: `<p class="box editor-only" *appHasRole="'editor'; else readOnly">
  <input placeholder="type, then change role" />
</p>`,
      },
      {
        task: 'Give the template a context: create the view with `{ $implicit: this.session.role() }` and read it with `*appHasRole="\'editor\'; let role"`.',
        expect:
          'The box can show "You are: admin". `let role` reads `$implicit`; other keys are read with `let x = key`.',
        solution: `// has-role.ts
if (template) this.viewContainer.createEmbeddedView(template, { $implicit: this.session.role() });

<!-- structural-demo.ts -->
<p *appHasRole="'editor'; else readOnly; let role">You are: {{ role }}</p>`,
      },
    ],
  },

  truncate: {
    files: ['pipes/truncate-pipe.ts'],
    tasks: [
      {
        task: 'Add a third argument, `wholeWords` (default false), that cuts at the last space before the limit.',
        expect: "`text | truncate: 30 : '…' : true` never ends in the middle of a word.",
        solution: `transform(value: string, limit = 20, ellipsis = '…', wholeWords = false): string {
  if (value.length <= limit) return value;
  let cut = value.slice(0, limit);
  if (wholeWords && cut.includes(' ')) cut = cut.slice(0, cut.lastIndexOf(' '));
  return cut.trimEnd() + ellipsis;
}`,
      },
      {
        task: 'Write a new `initials` pipe ("Ada Lovelace" → "AL") and use it in the demo.',
        expect: "`'Ada Lovelace' | initials` shows AL, and `'grace hopper' | initials` shows GH.",
        solution: `@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(/\\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  }
}`,
      },
    ],
  },

  pureImpure: {
    files: ['demos/pure-impure-demo.ts'],
    tasks: [
      {
        task: 'Predict first: click "Add with push()" (the pure row goes stale), then type one more letter in the filter. What happens?',
        expect:
          'The pure row catches up: an argument changed (`term`), so the pipe runs again and sees the mutated array.',
        solution: `No code. A pure pipe re-runs when any input or argument changes by ===.`,
      },
      {
        task: 'Turn `fruits` into a signal updated with `update((list) => [...list, fruit])`, and drop the push button.',
        expect: 'Both rows always agree, and the pure pipe stays the cheaper choice.',
        solution: `protected readonly fruits = signal(['apple', 'mango', 'orange']);
protected addAsNewArray(): void {
  this.fruits.update((list) => [...list, this.nextFruit()]);
}
<!-- template --> {{ (fruits() | filterPure: term()).join(', ') }}`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
