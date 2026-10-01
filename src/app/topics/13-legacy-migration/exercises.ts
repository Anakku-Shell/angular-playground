import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. Most of them run Angular's own migrations on the
 * `legacy/` folder: read each diff, then undo it with `git restore` before the next one, or keep
 * going and migrate the whole feature step by step.
 */
export const EXERCISES = {
  feature: {
    files: [
      'legacy/task.service.ts',
      'legacy/task-board.component.ts',
      'legacy/task-board.component.html',
    ],
    tasks: [
      {
        task: 'Add a "Clear done" button, in the legacy style: a `clearDone()` method in TaskService and a button in the board that calls it.',
        expect:
          'Done tasks disappear. Notice how much ceremony each piece needs compared with the modern cards below.',
        solution: `// task.service.ts
clearDone(): void {
  this.tasksSubject.next(this.tasksSubject.value.filter((task) => !task.done));
}

// task-board.component.ts
clearDone(): void {
  this.taskService.clearDone();
}

<!-- task-board.component.html -->
<button type="button" (click)="clearDone()">Clear done</button>`,
      },
      {
        task: 'Predict first, then try: delete `standalone: false` from `task-list.component.ts`.',
        expect:
          'The build fails with NG6008 "Component TaskListComponent is standalone, and cannot be declared in an NgModule. Did you mean to import it instead?": since v19, no flag means standalone.',
        solution: `standalone: false,`,
      },
    ],
  },

  modules: {
    files: ['legacy/tasks.module.ts'],
    tasks: [
      {
        task: 'Predict first, then try: remove `TaskBoardComponent` from the `exports` of TasksModule.',
        expect:
          'The build fails with NG8001 "\'app-task-board\' is not a known element": declared components are private to their module unless exported.',
        solution: `exports: [TaskBoardComponent, SaveStatusComponent],`,
      },
      {
        task: 'Run the first pass of the standalone migration: `npx ng g @angular/core:standalone --path src/app/topics/13-legacy-migration/legacy --mode convert-to-standalone`. Build, then run the topic tests.',
        expect:
          'It builds, but the tests fail with NG0919 "Cannot read @Component metadata": the migration made TaskBoardComponent import TasksModule, which imports TaskBoardComponent. Remove `TasksModule` from its `imports` and the tests pass. Always review the diff.',
        solution: `npx ng g @angular/core:standalone --path src/app/topics/13-legacy-migration/legacy --mode convert-to-standalone
npx ng test --watch=false --include src/app/topics/13-legacy-migration

// task-board.component.ts
imports: [FormsModule, TaskListComponent, AsyncPipe],`,
      },
    ],
  },

  inputsOutputs: {
    files: ['legacy/task-list.component.ts'],
    tasks: [
      {
        task: 'Run `npx ng g @angular/core:signal-input-migration --path src/app/topics/13-legacy-migration/legacy`, then `output-migration` with the same path.',
        expect:
          '`@Input()` fields become `input()` and every read becomes `this.tasks()`; the outputs become `output()`. `ngOnChanges` is left in place, now reading signals.',
        solution: `npx ng g @angular/core:signal-input-migration --path src/app/topics/13-legacy-migration/legacy
npx ng g @angular/core:output-migration --path src/app/topics/13-legacy-migration/legacy`,
      },
      {
        task: 'Finish by hand: replace `visible` + `ngOnChanges` with a `computed()`, and update the template to `visible()`.',
        expect: 'Same behaviour, no lifecycle hook. This is the step no schematic does for you.',
        solution: `protected readonly visible = computed(() =>
  this.filter() === 'all'
    ? this.tasks()
    : this.tasks().filter((task) => task.done === (this.filter() === 'done')),
);`,
      },
    ],
  },

  injection: {
    files: [
      'legacy/task-board.component.ts',
      'legacy/unlock.guard.ts',
      'legacy/save-status.component.ts',
    ],
    tasks: [
      {
        task: 'Run `npx ng g @angular/core:inject --path src/app/topics/13-legacy-migration/legacy`.',
        expect:
          'Three files change: constructor parameters become `inject()` fields. TaskBoard keeps an empty-bodied constructor for the `tasks$` assignment; move that line to a field initializer to finish.',
        solution: `private taskService = inject(TaskService);
readonly tasks$ = this.taskService.tasks$;`,
      },
    ],
  },

  templates: {
    files: ['legacy/task-list.component.html', 'legacy/task-board.component.html'],
    tasks: [
      {
        task: 'Run `npx ng g @angular/core:control-flow --path src/app/topics/13-legacy-migration/legacy` and read both template diffs.',
        expect:
          '`*ngIf ... else` becomes `@if / @else`, `*ngFor` becomes `@for` (keeping `trackById` as the track expression) and `[ngSwitch]` becomes `@switch`. Replace the track with `task.id` by hand.',
        solution: `@for (task of visible; track task.id) { ... }`,
      },
    ],
  },

  queriesHost: {
    files: ['legacy/task-board.component.ts'],
    tasks: [
      {
        task: 'Run `npx ng g @angular/core:signal-queries-migration --path src/app/topics/13-legacy-migration/legacy`.',
        expect:
          "`@ViewChild('titleInput') titleInput!` becomes `viewChild.required(...)` (the `!` told the migration it is always there), and the read becomes `this.titleInput()`.",
        solution: `readonly titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');`,
      },
      {
        task: "Move `@HostListener('document:keydown.escape')` into the decorator's `host` object by hand (no schematic does it).",
        expect: 'Escape still clears the input.',
        solution: `@Component({
  // ...
  host: { '(document:keydown.escape)': 'clearTitle()' },
})`,
      },
    ],
  },

  guards: {
    files: ['legacy/unlock.guard.ts', 'legacy/legacy.module.ts'],
    tasks: [
      {
        task: 'Without rewriting the class yet, use it through `mapToCanActivate([UnlockGuard])` in the route.',
        expect:
          'The vault behaves the same: `mapToCanActivate` wraps a class guard as a functional one, a safe first step.',
        solution: `canActivate: mapToCanActivate([UnlockGuard]),`,
      },
      {
        task: 'Rewrite it as a functional guard, `unlockGuard: CanActivateFn`, and use it in the route.',
        expect: 'Same behaviour, about half the code, and nothing left to provide.',
        solution: `export const unlockGuard: CanActivateFn = (_route, state) => {
  if (inject(VaultAccessService).unlocked) return true;
  const parentUrl = state.url.replace(/\\/vault(\\?.*)?$/, '');
  return inject(Router).createUrlTree([parentUrl], { queryParams: { blocked: 'vault' } });
};

canActivate: [unlockGuard],`,
      },
    ],
  },

  zoneless: {
    files: ['legacy/save-status.component.ts'],
    tasks: [
      {
        task: "Make `status` a signal (`status = signal('idle')`, `.set(...)` to write, `status()` in the template) and remove the `markForCheck` call.",
        expect:
          'Both buttons now end on "saved": a signal notifies Angular by itself, so the zone.js-era assumption no longer matters.',
        solution: `status = signal('idle');
// fakeSave: this.status.set('saving…') ... this.status.set('saved')
<!-- template --> Status: {{ status() }}`,
      },
    ],
  },

  migrations: {
    files: ['legacy/'],
    tasks: [
      {
        task: 'Run every migration from the cards above, one after the other, then `npx ng test --watch=false --include src/app/topics/13-legacy-migration`.',
        expect:
          'The 5 tests of this topic pass (after the TasksModule fix from the NgModule card): the migrations keep behaviour, and the tests prove it. Undo everything with `git restore src/app/topics/13-legacy-migration`.',
        solution: `P=src/app/topics/13-legacy-migration/legacy
npx ng g @angular/core:control-flow --path $P
npx ng g @angular/core:inject --path $P
npx ng g @angular/core:signal-input-migration --path $P
npx ng g @angular/core:output-migration --path $P
npx ng g @angular/core:signal-queries-migration --path $P
npx ng g @angular/core:standalone --path $P --mode convert-to-standalone`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
