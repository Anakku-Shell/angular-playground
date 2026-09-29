/** A legacy excerpt and its modern equivalent, shown side by side on the topic page. */
export interface SnippetPair {
  readonly legacy: string;
  readonly modern: string;
}

export const MODULES: SnippetPair = {
  legacy: `@NgModule({
  declarations: [TaskBoardComponent, TaskListComponent],
  imports: [CommonModule, FormsModule],
  exports: [TaskBoardComponent],
  providers: [TaskService],
})
export class TasksModule {}

// Lazy route: the module brings its own routes
{ path: 'tasks',
  loadChildren: () => import('./tasks.module')
    .then((m) => m.TasksModule) }`,
  modern: `@Component({
  selector: 'app-task-board',
  // Each component imports what its template uses
  imports: [TaskList, FormsModule],
  templateUrl: './task-board.html',
})
export class TaskBoard {}

// Lazy route: a component, or a Routes array
{ path: 'tasks',
  loadComponent: () => import('./task-board')
    .then((m) => m.TaskBoard) }`,
};

export const INPUTS_OUTPUTS: SnippetPair = {
  legacy: `@Input() tasks: Task[] = [];
@Input() filter: TaskFilter = 'all';
@Output() toggled = new EventEmitter<number>();

visible: Task[] = [];

ngOnChanges(): void {
  this.visible = this.filter === 'all'
    ? this.tasks
    : this.tasks.filter(/* … */);
}`,
  modern: `readonly tasks = input<Task[]>([]);
readonly filter = input<TaskFilter>('all');
readonly toggled = output<number>();

// Recomputed when an input changes, no hook
protected readonly visible = computed(() =>
  this.filter() === 'all'
    ? this.tasks()
    : this.tasks().filter(/* … */),
);`,
};

export const INJECTION: SnippetPair = {
  legacy: `export class TaskBoardComponent {
  readonly tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }
}`,
  modern: `export class TaskBoard {
  private readonly taskService = inject(TaskService);
  // Field initializers can use injected services
  protected readonly tasks = this.taskService.tasks;
}`,
};

export const TEMPLATES: SnippetPair = {
  legacy: `<app-task-list
  *ngIf="tasks$ | async as tasks; else loading"
  [tasks]="tasks" />
<ng-template #loading>Loading…</ng-template>

<li *ngFor="let task of visible; trackBy: trackById">

<p [ngSwitch]="filter">
  <span *ngSwitchCase="'open'">Nothing left.</span>
  <span *ngSwitchDefault>No tasks.</span>
</p>`,
  modern: `@if (tasks(); as tasks) {
  <app-task-list [tasks]="tasks" />
} @else {
  Loading…
}

@for (task of visible(); track task.id) { <li>…</li> }

@switch (filter()) {
  @case ('open') { <span>Nothing left.</span> }
  @default { <span>No tasks.</span> }
}`,
};

export const QUERIES_HOST: SnippetPair = {
  legacy: `@ViewChild('titleInput')
titleInput!: ElementRef<HTMLInputElement>;

@HostListener('document:keydown.escape')
clearTitle(): void { /* … */ }

// In a directive
@HostBinding('style.backgroundColor') background = '';
@HostListener('mouseenter') onEnter(): void { /* … */ }`,
  modern: `private readonly titleInput =
  viewChild.required<ElementRef<HTMLInputElement>>('titleInput');

@Component({
  host: { '(document:keydown.escape)': 'clearTitle()' },
})

// In a directive
@Directive({
  host: {
    '[style.backgroundColor]': 'background()',
    '(mouseenter)': 'onEnter()',
  },
})`,
};

export const GUARDS: SnippetPair = {
  legacy: `@Injectable({ providedIn: 'root' })
export class UnlockGuard implements CanActivate {
  constructor(
    private access: VaultAccessService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    return this.access.unlocked
      || this.router.createUrlTree(['/']);
  }
}

{ path: 'vault', canActivate: [UnlockGuard] }`,
  modern: `export const unlockGuard: CanActivateFn = () =>
  inject(VaultAccess).unlocked()
  || inject(Router).createUrlTree(['/']);

{ path: 'vault', canActivate: [unlockGuard] }

// While migrating, a class guard can be wrapped:
{ canActivate: mapToCanActivate([UnlockGuard]) }`,
};

export const ZONELESS: SnippetPair = {
  legacy: `status = 'idle';

save(): void {
  this.status = 'saving…';
  setTimeout(() => {
    // zone.js ran change detection after every
    // callback; zoneless Angular does not
    this.status = 'saved';
    this.changeDetector.markForCheck();
  }, 800);
}`,
  modern: `protected readonly status = signal('idle');

save(): void {
  this.status.set('saving…');
  setTimeout(() => {
    // A signal read by the template marks the
    // view for update by itself
    this.status.set('saved');
  }, 800);
}`,
};

export const MIGRATION_COMMANDS = `# 1. Update one major version at a time (19 → 20 → 21)
ng update @angular/core@20 @angular/cli@20

# 2. Optional migrations, one at a time, reviewing the diff in between
ng generate @angular/core:standalone         # 3 passes: convert, prune modules, bootstrap
ng generate @angular/core:control-flow       # *ngIf / *ngFor / [ngSwitch] → @if / @for / @switch
ng generate @angular/core:inject             # constructor DI → inject()
ng generate @angular/core:signal-input-migration
ng generate @angular/core:output-migration
ng generate @angular/core:signal-queries-migration
ng generate @angular/core:route-lazy-loading # eager route components → loadComponent
ng generate @angular/core:cleanup-unused-imports

# Every one accepts --path to migrate a single folder first
ng generate @angular/core:control-flow --path src/app/tasks`;
