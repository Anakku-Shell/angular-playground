import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  highlight: {
    label: 'Attribute directive',
    question: 'add behaviour to an existing element with an attribute',
    use: '`@Directive` + `host`',
    why: 'Some behaviour belongs to many elements, not to one component: highlight on hover, a tooltip, autofocus. A directive is a class with no template that attaches to any element through an attribute, like `<p appHighlight>`.',
    steps: [
      {
        action: 'Hover each of the three boxes.',
        result: 'Each one is painted while the pointer is over it: one directive, three elements.',
      },
      {
        action: 'Pick another color, then hover the second box.',
        result:
          'It uses the new color: `[appHighlight]="color()"` is an input of the directive, bound like any other.',
      },
      {
        action: 'Compare the first and the third box.',
        result:
          'With no value the directive falls back to `defaultColor`, a second input; the third box sets it to orange.',
      },
    ],
    snippet: `@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'hovered() ? color() : null',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class Highlight {
  readonly appHighlight = input('');      // <p appHighlight="pink">
}`,
    read: [
      {
        file: 'directives/highlight.ts',
        lookFor:
          'The three kinds of directive in the header, then [1] the selector, [2] the host bindings and listeners, [3] the inputs.',
      },
      {
        file: 'demos/highlight-demo.ts',
        lookFor: 'Three ways to use it.',
      },
    ],
  },

  tooltip: {
    label: 'Tooltip',
    question: 'react to events on the host and create a component from code',
    use: '`host` listeners, `ViewContainerRef.createComponent()`',
    why: 'A tooltip needs to react to hover and focus on its host, and to show a bubble that has its own template. A directive has no template, so it creates a small component from code and destroys it when done.',
    steps: [
      {
        action: 'Hover the Save button.',
        result:
          'A bubble appears below it, and disappears when you leave: the directive listens to `mouseenter` and `mouseleave` on its host.',
      },
      {
        action: 'Press Tab until the `<code>` element is focused, then press Escape.',
        result:
          'Focus shows the tooltip too, and Escape hides it: keyboard users get the same behaviour.',
      },
    ],
    snippet: `@Directive({
  selector: '[appTooltip]',
  host: { '(mouseenter)': 'show()', '(mouseleave)': 'hide()' },
})
export class Tooltip {
  private readonly viewContainer = inject(ViewContainerRef);
  private bubble?: ComponentRef<TooltipBubble>;

  show() { this.bubble = this.viewContainer.createComponent(TooltipBubble); }
  hide() { this.bubble?.destroy(); }
}`,
    read: [
      {
        file: 'directives/tooltip.ts',
        lookFor:
          '[1] the bubble component, [2] the host listeners, [3] creating it, [4] destroying it.',
      },
      {
        file: 'demos/tooltip-demo.ts',
        lookFor: 'The same directive on three kinds of element.',
      },
    ],
  },

  dropdown: {
    label: 'exportAs',
    question: "use a directive's state and methods from the template",
    use: '`exportAs`, `document:` listeners',
    why: 'A dropdown keeps its open state in a directive, but the button and the list in the template need to read and change it. `exportAs` gives the directive a name for a template reference, and global listeners close the menu on any outside click.',
    steps: [
      {
        action: 'Click "Actions ▾", then pick an action.',
        result:
          'The menu closes and "Closed by" says "item picked". The template called `menu.toggle()` and `menu.close()` through `#menu="appDropdown"`.',
      },
      {
        action: 'Open it again and click anywhere outside.',
        result: '"outside click": the directive listens to clicks on the whole `document`.',
      },
      {
        action: 'Open it and press Escape.',
        result:
          '"Escape": another global listener. The reason reached the demo through the directive\'s `closed` output.',
      },
    ],
    snippet: `@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class Dropdown { isOpen = signal(false); toggle() { ... } }

<div appDropdown #menu="appDropdown">
  <button (click)="menu.toggle()">Actions</button>
  @if (menu.isOpen()) { <ul>...</ul> }
</div>`,
    read: [
      {
        file: 'directives/dropdown.ts',
        lookFor: '[1] `exportAs`, [2] the global listeners, [3] the output.',
      },
      {
        file: 'demos/dropdown-demo.ts',
        lookFor: 'The `#menu` reference and everything that uses it.',
      },
    ],
  },

  hostDirectives: {
    label: 'hostDirectives',
    question: 'give a component the behaviour of existing directives',
    use: '`hostDirectives: [...]`',
    why: 'A tag component should always highlight and always have a tooltip. Instead of writing that logic again, or asking every user to add two attributes, the component lists both directives in `hostDirectives` and they come with it.',
    steps: [
      {
        action: 'Hover or focus each tag.',
        result:
          'Highlight and tooltip both work, but the template only says `<app-tag color="…" hint="…">`.',
      },
      {
        action: 'Look at the dot that appears on hover.',
        result:
          'The component injected its `Highlight` host directive and reads its `hovered()` signal.',
      },
    ],
    snippet: `@Component({
  selector: 'app-tag',
  hostDirectives: [
    { directive: Highlight, inputs: ['appHighlight: color'] },   // exposed as "color"
    { directive: Tooltip, inputs: ['appTooltip: hint'] },
  ],
})
export class Tag {}

<app-tag color="pink" hint="Zoneless is the default">zoneless</app-tag>`,
    read: [
      {
        file: 'demos/host-directives-demo.ts',
        lookFor:
          '[1] the composition and its input aliases, [2] the component reading a host directive.',
      },
    ],
  },

  structural: {
    label: 'Structural directive',
    question: 'show or hide content with your own rule (like a custom @if)',
    use: '`TemplateRef` + `ViewContainerRef`',
    why: '`@if` covers most cases, but a rule you repeat everywhere, like "only for editors", reads better as its own directive. A structural directive receives a template and decides when to stamp it into the page.',
    steps: [
      {
        action: 'Switch the role between guest, editor and admin.',
        result:
          'Guests see the read-only box, editors the editor box, admins both the editor and the admin box.',
      },
      {
        action: 'Compare the two ways it is written in the code.',
        result:
          'The `*` form is shorthand: Angular wraps the element in an `<ng-template>` and passes it to the directive.',
      },
    ],
    snippet: `@Directive({ selector: '[appHasRole]' })
export class HasRole {
  readonly appHasRole = input.required<Role>();
  private readonly template = inject(TemplateRef);
  private readonly container = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      this.container.clear();
      if (this.allowed()) this.container.createEmbeddedView(this.template);
    });
  }
}

<p *appHasRole="'editor'">Only editors see this</p>`,
    read: [
      {
        file: 'directives/has-role.ts',
        lookFor:
          '[1] the inputs, including `else`, [2] the template and the container, [3] the effect that stamps it.',
      },
      {
        file: 'demos/structural-demo.ts',
        lookFor: 'The `*` form and the explicit `<ng-template>` form.',
      },
      {
        file: 'session.ts',
        lookFor: 'The fake user and its roles.',
      },
    ],
  },

  truncate: {
    label: 'Custom pipe',
    question: 'write your own display transformation',
    use: '`@Pipe` + `transform()`',
    why: 'When the same formatting appears in many templates, like cutting long text, a pipe keeps it in one place and reads naturally: `text | truncate: 30`.',
    steps: [
      {
        action: 'Move the Limit slider.',
        result: 'The second and third rows follow: `limit()` is passed as the first argument.',
      },
      {
        action: 'Compare the three rows.',
        result:
          'No arguments uses the defaults (20 and "…"); the third row also replaces the ellipsis.',
      },
    ],
    snippet: `@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, ellipsis = '…'): string {
    return value.length > limit ? value.slice(0, limit) + ellipsis : value;
  }
}

{{ text | truncate: 30 : ' [more]' }}`,
    read: [
      {
        file: 'pipes/truncate-pipe.ts',
        lookFor: 'The whole pipe: a name and a `transform()` method.',
      },
      {
        file: 'demos/truncate-demo.ts',
        lookFor: 'Imported like a component, used with zero, one and two arguments.',
      },
    ],
  },

  pureImpure: {
    label: 'Pure vs impure',
    question: 'understand when a pipe runs again',
    use: '`pure: false`',
    why: 'A pure pipe (the default) only runs again when one of its inputs changes by reference. That is fast, but it misses changes made inside an array or object. An impure pipe runs on every check: always right, but costly.',
    steps: [
      {
        action: 'Click "Add with push() (mutation)".',
        result:
          'The array and the impure row show banana; the pure row does not: the array is the same object, so the pure pipe did not run.',
      },
      {
        action: 'Click "Add as a new array".',
        result: 'Both rows agree again: a new array is a new input.',
      },
    ],
    snippet: `@Pipe({ name: 'filterPure' })                 // runs when an input changes (===)
@Pipe({ name: 'filterImpure', pure: false })  // runs on every change detection

this.fruits.push('banana');                   // same array: pure pipe misses it
this.fruits = [...this.fruits, 'banana'];     // new array: both see it`,
    read: [
      {
        file: 'pipes/filter-pipe.ts',
        lookFor: 'The same logic as a [1] pure and an [2] impure pipe.',
      },
      {
        file: 'demos/pure-impure-demo.ts',
        lookFor: '[1] mutating the array, [2] replacing it.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
