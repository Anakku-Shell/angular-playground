import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  lifecycle: {
    label: 'Lifecycle hooks',
    question: "run code at a given moment of a component's life",
    use: '`ngOnInit`, `ngOnChanges`, `ngOnDestroy`…',
    why: 'A component is created, receives its inputs, renders, updates and is destroyed. Lifecycle hooks are methods Angular calls at each of those moments. Signals replace most of them, but older code uses them everywhere.',
    steps: [
      {
        action: 'Click "Clear log", "Destroy child", then "Create child".',
        result:
          'The log lists the creation in order: constructor, ngOnChanges, ngOnInit, then content and view. The constructor cannot read the input yet; ngOnInit can.',
      },
      {
        action: 'Click "Change input".',
        result:
          'Only ngOnChanges runs, with the previous and the new value. The "init" hooks run once.',
      },
      {
        action: 'Click "Destroy child".',
        result: 'The cleanup runs: the DestroyRef callback and ngOnDestroy.',
      },
    ],
    snippet: `export class Child implements OnChanges, OnInit, OnDestroy {
  readonly label = input.required<string>();

  ngOnChanges(changes: SimpleChanges<Child>) { /* an input changed */ }
  ngOnInit() { this.label(); /* inputs are set from here on */ }
  ngOnDestroy() { /* clean up */ }
}`,
    read: [
      {
        file: 'demos/lifecycle/lifecycle-child.ts',
        lookFor:
          '[1] the constructor, [2] ngOnChanges, [3] ngOnInit, [4] the rest, in the order they run.',
      },
      {
        file: 'demos/lifecycle-demo.ts',
        lookFor: 'The table of modern replacements in the header comment.',
      },
    ],
  },

  renderHooks: {
    label: 'Render hooks',
    question: 'touch the DOM after Angular has rendered it',
    use: '`afterNextRender()`, `afterEveryRender()`',
    why: 'Measuring an element, focusing it or starting a DOM library needs the DOM to exist and be up to date. Render hooks run right after Angular renders, and never on the server.',
    steps: [
      {
        action: 'Look at "Width measured by afterNextRender".',
        result: 'Measured once, after the first render, when the list existed and had a size.',
      },
      {
        action: 'Click "Add message" several times.',
        result:
          'The list stays scrolled to the bottom and "Renders seen" goes up: `afterEveryRender` runs after each render.',
      },
      {
        action: 'Click "Unrelated update".',
        result:
          '"Renders seen" goes up too: the hook runs after every render of the app, not only of this list.',
      },
    ],
    snippet: `constructor() {
  afterNextRender({                       // once
    read: () => this.width.set(this.list().nativeElement.offsetWidth),
  });
  afterEveryRender({                      // after every render
    write: () => (this.list().nativeElement.scrollTop = 99999),
  });
}`,
    read: [
      {
        file: 'demos/render-hooks-demo.ts',
        lookFor:
          '[1] `afterNextRender` measuring, [2] `afterEveryRender` scrolling, [3] why it must not set signals.',
      },
    ],
  },

  onPush: {
    label: 'OnPush',
    question: 'understand when a component re-renders',
    use: '`ChangeDetectionStrategy.OnPush`',
    why: 'Re-checking every component on every event is wasteful. With OnPush (used everywhere in this project) Angular only checks a component when something marks it: a new input value, an event in its template, a signal it reads, or `markForCheck()`.',
    steps: [
      {
        action: 'Click "Mutate (same object)" twice.',
        result:
          "The parent shows 2 visits, the child still 0. The object was changed in place, so the child's input is the same reference and nothing marked the child.",
      },
      {
        action: 'Click "Event in the child".',
        result:
          'The child jumps to the right number: the event marked it, and when it was checked it read the mutated object.',
      },
      {
        action: 'Click "Replace (new object)".',
        result: 'Both update at once: a new object is a new input value. This is the right way.',
      },
    ],
    snippet: `@Component({ changeDetection: ChangeDetectionStrategy.OnPush, ... })
export class UserCard { readonly user = input.required<User>(); }

this.user().visits++;                                    // ✗ same object: child not checked
this.user.update((u) => ({ ...u, visits: u.visits + 1 })); // ✓ new object: child checked`,
    read: [
      {
        file: 'demos/on-push/user-card.ts',
        lookFor: 'The OnPush child and the four things that mark it.',
      },
      {
        file: 'demos/on-push-demo.ts',
        lookFor: '[1] mutating, [2] replacing, [3] `markForCheck()` from outside.',
      },
    ],
  },

  zoneless: {
    label: 'Zoneless',
    question: 'know what tells Angular to refresh the view',
    use: 'signals, template events, `markForCheck()`',
    why: 'Older apps used zone.js, which refreshed the view after any timer, promise or event. Angular 21 is zoneless: it refreshes only when told. Signals tell it automatically; a plain field changed in a timer does not.',
    steps: [
      {
        action: 'Click "setTimeout → plain field" and wait.',
        result:
          'Nothing changes: the field went up after half a second, but nothing told Angular to look.',
      },
      {
        action: 'Click "Plain field in the click handler".',
        result:
          'The field jumps by 2: the click (an event bound in the template) caused a refresh, which showed both changes.',
      },
      {
        action: 'Click "setTimeout → signal".',
        result: 'It updates after half a second on its own: the signal told Angular.',
      },
      {
        action: 'Click "setTimeout → plain field + markForCheck()".',
        result: 'It updates too: `markForCheck()` is the manual way to tell Angular.',
      },
    ],
    snippet: `setTimeout(() => this.plain++);                    // ✗ nobody is told
setTimeout(() => this.count.update((n) => n + 1)); // ✓ a signal tells Angular
setTimeout(() => {
  this.plain++;
  this.cdr.markForCheck();                         // ✓ told by hand
});`,
    read: [
      {
        file: 'demos/zoneless-demo.ts',
        lookFor: 'The list of what triggers a refresh, then one method per button, [1] to [4].',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
