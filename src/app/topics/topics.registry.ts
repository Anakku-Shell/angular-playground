import { Route } from '@angular/router';

/** What the sidebar and the home page show for a topic. */
interface TopicInfo {
  /** Two-digit order, e.g. '01'. Also used as the `track` key in lists. */
  readonly id: string;
  /** URL segment under `/topics`, e.g. '01-components-templates'. */
  readonly path: string;
  readonly title: string;
  readonly summary: string;
}

/**
 * A topic is lazy-loaded either as a single page (`loadComponent`) or as a
 * set of child routes (`loadChildren`). The union with `never` makes
 * TypeScript reject an entry that has both or neither.
 */
type TopicLoader =
  | { readonly loadComponent: NonNullable<Route['loadComponent']>; readonly loadChildren?: never }
  | { readonly loadChildren: NonNullable<Route['loadChildren']>; readonly loadComponent?: never };

export type Topic = TopicInfo & TopicLoader;

/**
 * Single source of truth for the playground topics: the sidebar, the home
 * page and the routes (`app.routes.ts`) are all built from this list.
 * Adding a topic = adding one entry here.
 */
export const TOPICS: readonly Topic[] = [
  {
    id: '01',
    path: '01-components-templates',
    title: 'Components & templates',
    summary:
      'Interpolation, bindings, events, template variables, @let, built-in pipes and style encapsulation.',
    loadComponent: () =>
      import('./01-components-templates/topic-page').then((m) => m.ComponentsTemplatesPage),
  },
  {
    id: '02',
    path: '02-control-flow',
    title: 'Control flow',
    summary:
      '@if, @for with track, @switch, @defer and its triggers, and the legacy structural directives.',
    loadComponent: () => import('./02-control-flow/topic-page').then((m) => m.ControlFlowPage),
  },
  {
    id: '03',
    path: '03-component-communication',
    title: 'Component communication',
    summary:
      'input(), output(), model(), content projection, view and content queries, and sharing state through a service.',
    loadComponent: () =>
      import('./03-component-communication/topic-page').then((m) => m.ComponentCommunicationPage),
  },
  {
    id: '04',
    path: '04-signals',
    title: 'Signals & reactivity',
    summary:
      'signal, computed, effect, linkedSignal, untracked, equality functions, resource and RxJS interop.',
    loadComponent: () => import('./04-signals/topic-page').then((m) => m.SignalsPage),
  },
  {
    id: '05',
    path: '05-dependency-injection',
    title: 'Dependency injection',
    summary:
      'providedIn root, component providers and viewProviders, InjectionToken, provider recipes, resolution modifiers, DestroyRef and the injection context.',
    loadComponent: () =>
      import('./05-dependency-injection/topic-page').then((m) => m.DependencyInjectionPage),
  },
  {
    id: '06',
    path: '06-lifecycle-change-detection',
    title: 'Lifecycle & change detection',
    summary:
      'Lifecycle hooks, afterNextRender and afterEveryRender, what refreshes an OnPush component, and zoneless change detection.',
    loadComponent: () =>
      import('./06-lifecycle-change-detection/topic-page').then(
        (m) => m.LifecycleChangeDetectionPage,
      ),
  },
  {
    id: '07',
    path: '07-routing',
    title: 'Routing',
    summary:
      'Child routes and a nested outlet, params as inputs, functional guards and resolvers, redirects, wildcards and programmatic navigation.',
    // loadChildren: the topic brings its own Routes array (07-routing.routes.ts).
    loadChildren: () => import('./07-routing/07-routing.routes').then((m) => m.ROUTING_ROUTES),
  },
  {
    id: '08',
    path: '08-forms',
    title: 'Forms',
    summary:
      'Template-driven forms, typed reactive forms, FormArray, custom, async and cross-field validators, and experimental signal forms.',
    loadComponent: () => import('./08-forms/topic-page').then((m) => m.FormsPage),
  },
  {
    id: '09',
    path: '09-http-rxjs',
    title: 'HTTP & RxJS',
    summary:
      'HttpClient with functional interceptors, a typed API service, RxJS essentials, search-as-you-type and httpResource.',
    loadComponent: () => import('./09-http-rxjs/topic-page').then((m) => m.HttpRxjsPage),
  },
  {
    id: '10',
    path: '10-directives-pipes',
    title: 'Directives & pipes',
    summary:
      'Custom attribute and structural directives, host bindings and listeners, exportAs, hostDirectives composition, and pure vs impure pipes.',
    loadComponent: () =>
      import('./10-directives-pipes/topic-page').then((m) => m.DirectivesPipesPage),
  },
  {
    id: '11',
    path: '11-state-management',
    title: 'State management',
    summary:
      'A store service with signals, the same feature with NgRx SignalStore, rxMethod for async effects and signalState for local state.',
    loadComponent: () =>
      import('./11-state-management/topic-page').then((m) => m.StateManagementPage),
  },
  {
    id: '12',
    path: '12-testing',
    title: 'Testing',
    summary:
      'Vitest and TestBed: component inputs, outputs and model, signal services, HttpTestingController, mocking through DI and RouterTestingHarness.',
    loadComponent: () => import('./12-testing/topic-page').then((m) => m.TestingPage),
  },
  {
    id: '13',
    path: '13-legacy-migration',
    title: 'Legacy & migration',
    summary:
      'A feature built with NgModules, decorators, constructor DI, structural directives and a class guard, next to the modern equivalents and the migration schematics.',
    // loadChildren can also resolve to an NgModule class: the pre-standalone way to lazy-load.
    loadChildren: () =>
      import('./13-legacy-migration/legacy/legacy.module').then((m) => m.LegacyModule),
  },
  {
    id: '14',
    path: '14-coming-from-vue',
    title: 'Coming from Vue',
    summary:
      'Vue 3 next to Angular: components, templates, props and emits, Pinia vs services, then a full CRUD flow from form to server and back.',
    loadComponent: () => import('./14-coming-from-vue/topic-page').then((m) => m.ComingFromVuePage),
  },
];

/** Router link for a topic page. */
export function topicUrl(topic: Pick<Topic, 'path'>): string {
  return `/topics/${topic.path}`;
}
