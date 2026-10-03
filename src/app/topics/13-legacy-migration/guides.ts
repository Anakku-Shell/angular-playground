import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files. Most cards compare a legacy excerpt with its modern version.
 */
export const GUIDES = {
  feature: {
    label: 'The legacy feature',
    question: 'recognise code written before v17',
    use: 'NgModules, decorators, `*ngIf`, zone.js',
    why: 'Most existing Angular apps were written before signals and standalone components, and you will maintain them. This card is a small task board written entirely the old way, so the patterns look familiar when you meet them at work.',
    steps: [
      {
        action: 'Add a task, tick one, and switch the filters.',
        result:
          'It works like any modern feature. The differences are all in the code: a `BehaviorSubject` with the `async` pipe, `@Input()` / `@Output()`, `*ngFor`…',
      },
      {
        action: 'Hover a task.',
        result:
          'The highlight comes from a directive written with `@HostBinding` and `@HostListener`.',
      },
      {
        action: 'Type in the input and press Escape.',
        result: 'It clears: a `@HostListener` on `document`, in the board component.',
      },
    ],
    snippet: `@NgModule({
  declarations: [TaskBoardComponent, TaskListComponent],   // belong to this module
  imports: [CommonModule, FormsModule],                     // what their templates use
  exports: [TaskBoardComponent],                            // what importers can use
  providers: [TaskService],
})
export class TasksModule {}`,
    read: [
      {
        file: 'legacy/tasks.module.ts',
        lookFor: 'What each array of an NgModule means.',
      },
      {
        file: 'legacy/task-board.component.ts',
        lookFor:
          '[1] `standalone: false`, [2] a decorator query, [3] constructor injection, [4] a host listener.',
      },
      {
        file: 'legacy/task-list.component.ts',
        lookFor: '[1] decorator inputs and outputs, [2] derived state in `ngOnChanges`.',
      },
      {
        file: 'legacy/task.service.ts',
        lookFor: 'State in a `BehaviorSubject`.',
      },
    ],
  },

  modules: {
    label: 'NgModule → standalone',
    question: 'replace NgModules with standalone components',
    use: '`ng g @angular/core:standalone`',
    why: 'An NgModule groups components and decides what their templates can use. Standalone components (the default since v19) import what they use themselves, which makes every file self-explanatory and lets routes lazy-load a single component.',
    steps: [
      {
        action: 'Compare the two columns.',
        result:
          "The module's `imports` moved into each component, `declarations` disappeared, and the lazy route loads a component instead of a module.",
      },
      {
        action: 'Read the header of `legacy/legacy.module.ts`.',
        result:
          'A routed module with `RouterModule.forChild`. This page itself is a standalone component inside it: both worlds mix.',
      },
    ],
    snippet: `// before: the module decides what the template can use
@NgModule({ declarations: [TaskBoard], imports: [FormsModule] })

// after: the component imports it itself
@Component({ selector: 'app-task-board', imports: [FormsModule, TaskList] })`,
    read: [
      {
        file: 'legacy/legacy.module.ts',
        lookFor: 'A routed module that points to a standalone page.',
      },
      {
        file: 'topic-page.ts',
        lookFor: 'A standalone component importing an NgModule (`TasksModule`).',
      },
    ],
  },

  inputsOutputs: {
    label: 'Inputs & outputs',
    question: 'move from @Input / @Output to input() / output()',
    use: '`ng g @angular/core:signal-input-migration`, `output-migration`',
    why: '`@Input()` fields are plain properties: to react to changes you need `ngOnChanges`. `input()` returns a signal, so derived values are a `computed()` and update by themselves.',
    steps: [
      {
        action: 'Compare the two columns.',
        result: 'The `ngOnChanges` method and the `visible` field became one `computed()`.',
      },
      {
        action: 'Notice the `()` in the modern column.',
        result:
          '`this.filter()`: inputs are now signals, so every read adds parentheses, in the class and in the template.',
      },
    ],
    snippet: `@Input() filter = 'all';                      →  readonly filter = input('all');
@Output() toggled = new EventEmitter<number>();  →  readonly toggled = output<number>();
ngOnChanges() { this.visible = ... }          →  visible = computed(() => ...);`,
    read: [
      {
        file: 'legacy/task-list.component.ts',
        lookFor: 'The legacy version, [1] and [2].',
      },
      {
        file: '../03-component-communication/demos/outputs/star-rating.ts',
        lookFor: 'The modern version in a real component.',
      },
    ],
  },

  injection: {
    label: 'inject()',
    question: 'move from constructor injection to inject()',
    use: '`ng g @angular/core:inject`',
    why: 'Older code receives services as constructor parameters. `inject()` gets them in a field initializer, which is shorter, works in functions (guards, interceptors) and lets other fields use the service right away.',
    steps: [
      {
        action: 'Compare the two columns.',
        result:
          'The constructor disappeared: the service is a field, and `tasks` is initialised from it on the next line.',
      },
    ],
    snippet: `constructor(private taskService: TaskService) {}     // before

private readonly taskService = inject(TaskService);   // after`,
    read: [
      {
        file: 'legacy/task-board.component.ts',
        lookFor: '[3] the constructor parameter.',
      },
    ],
  },

  templates: {
    label: 'Control flow',
    question: 'move templates from *ngIf / *ngFor to @if / @for',
    use: '`ng g @angular/core:control-flow`',
    why: 'Structural directives need imports, an `<ng-template>` for the else branch and a function for `trackBy`. The built-in blocks need none of that, and they are easier to read and faster.',
    steps: [
      {
        action: 'Compare the two columns.',
        result:
          'Same three patterns: the `else` template becomes `@else`, `trackBy` becomes `track task.id`, and `[ngSwitch]` becomes `@switch`.',
      },
      {
        action: 'Open the "Legacy" card of the Control flow topic.',
        result: 'The same comparison, running live side by side.',
      },
    ],
    snippet: `*ngIf="cond; else other"       →  @if (cond) { … } @else { … }
*ngFor="let t of list; trackBy: byId"  →  @for (t of list; track t.id) { … }
[ngSwitch] + *ngSwitchCase     →  @switch (x) { @case (…) { … } }`,
    read: [
      {
        file: 'legacy/task-board.component.html',
        lookFor: '`*ngIf` with `else` and the `async` pipe.',
      },
      {
        file: 'legacy/task-list.component.html',
        lookFor: '`*ngFor` with `trackBy`, and `[ngSwitch]`.',
      },
    ],
  },

  queriesHost: {
    label: 'Queries & host',
    question: 'move from @ViewChild / @HostListener to viewChild() / host',
    use: '`ng g @angular/core:signal-queries-migration`',
    why: '`@ViewChild` fields are set late and are undefined in the constructor; `viewChild()` is a signal. `@HostBinding` and `@HostListener` move into the `host` object of the decorator, where all host behaviour sits together.',
    steps: [
      {
        action: 'Compare the two columns.',
        result:
          'The query became a signal (no `!`), and the listeners and bindings moved into `host: { … }`.',
      },
    ],
    snippet: `@ViewChild('title') title!: ElementRef;   →  title = viewChild.required<ElementRef>('title');
@HostListener('mouseenter') onEnter() {}   →  host: { '(mouseenter)': 'onEnter()' }
@HostBinding('class.on') on = false;       →  host: { '[class.on]': 'on()' }`,
    read: [
      {
        file: 'legacy/highlight.directive.ts',
        lookFor: '`@HostBinding` and `@HostListener`.',
      },
      {
        file: '../10-directives-pipes/directives/highlight.ts',
        lookFor: 'The same directive, written with `host`.',
      },
    ],
  },

  guards: {
    label: 'Class guards',
    question: 'move from class guards to functional guards',
    use: 'a `CanActivateFn` (by hand)',
    why: 'Older guards are classes that implement `CanActivate` and get services through the constructor. Functional guards are plain functions that call `inject()`. There is no schematic: you rewrite them by hand.',
    steps: [
      {
        action: 'With "Unlocked" off, click "Open the vault".',
        result: 'The class guard sends you back here with a message: it returned a `UrlTree`.',
      },
      {
        action: 'Tick "Unlocked" and open the vault again.',
        result: 'Now it opens, in the outlet just below.',
      },
    ],
    snippet: `// before
@Injectable({ providedIn: 'root' })
export class UnlockGuard implements CanActivate {
  constructor(private access: VaultAccess) {}
  canActivate() { return this.access.unlocked; }
}

// after
export const unlockGuard: CanActivateFn = () => inject(VaultAccess).unlocked;`,
    read: [
      {
        file: 'legacy/unlock.guard.ts',
        lookFor: 'The class guard and its redirect.',
      },
      {
        file: 'legacy/legacy.module.ts',
        lookFor: 'Where it is attached: `canActivate: [UnlockGuard]`.',
      },
      {
        file: '../07-routing/demos/guards.ts',
        lookFor: 'Functional guards, the modern way.',
      },
    ],
  },

  zoneless: {
    label: 'zone.js → zoneless',
    question: 'fix legacy code that stops updating in a zoneless app',
    use: 'signals, or `markForCheck()`',
    why: 'With zone.js, Angular refreshed the view after every timer or HTTP callback, so writing a plain field was enough. Angular 21 is zoneless: that legacy code still runs, but the view no longer shows the new value.',
    steps: [
      {
        action: 'Click "Save (plain field)".',
        result:
          'It stays on "saving…": the field became "saved" later, but nothing told Angular to look.',
      },
      {
        action: 'Click "Save (field + markForCheck)".',
        result:
          'It reaches "saved": `markForCheck()` tells Angular by hand. A signal would do it by itself.',
      },
    ],
    snippet: `setTimeout(() => (this.status = 'saved'));          // ✗ zoneless: not rendered
setTimeout(() => {
  this.status = 'saved';
  this.changeDetector.markForCheck();               // ✓ quick fix
});
setTimeout(() => this.status.set('saved'));          // ✓ the modern fix: a signal`,
    read: [
      {
        file: 'legacy/save-status.component.ts',
        lookFor: '[1] the button that breaks, [2] the one fixed with `markForCheck()`.',
      },
    ],
  },

  migrations: {
    label: 'Running migrations',
    question: 'update a project and migrate it with the schematics',
    use: '`ng update`, `ng generate @angular/core:…`',
    why: 'You rarely migrate by hand. `ng update` moves one major version at a time, and the Angular schematics rewrite the code to the modern APIs, one kind of change per command.',
    steps: [
      {
        action: 'Read the commands in the demo area.',
        result: 'First the version update, then the optional migrations, each one on its own.',
      },
      {
        action: 'Do the first exercise below.',
        result:
          'You run a real schematic on `legacy/` and read its diff: the best way to see what it does.',
      },
    ],
    snippet: `ng update @angular/core@21 @angular/cli@21
ng generate @angular/core:control-flow --path src/app/tasks
git diff        # review, test, commit; then the next migration`,
    read: [
      {
        file: 'snippets.ts',
        lookFor: '`MIGRATION_COMMANDS`, with a comment per schematic.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
