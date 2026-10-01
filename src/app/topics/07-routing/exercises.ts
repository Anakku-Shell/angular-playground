import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  childRoutes: {
    files: ['07-routing.routes.ts', 'demos/mini-app.html'],
    tasks: [
      {
        task: 'Add an `about` child route with a small inline component and the title "About", plus a link to it in the mini app nav.',
        expect:
          'The link opens the view, gets highlighted, and the browser tab shows "About · Routing · Angular Playground".',
        solution: `// 07-routing.routes.ts (before the '**' route)
{ path: 'about', title: pageTitle('About'), component: AboutView },

// demos/views/about-view.ts
@Component({
  selector: 'app-about-view',
  template: '<h3>About</h3><p>A route added by you.</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutView {}

<!-- mini-app.html -->
<a routerLink="about" routerLinkActive="is-active">About</a>`,
      },
      {
        task: 'Add `[routerLinkActiveOptions]="{ exact: true }"` to the Products link, then open a product.',
        expect:
          'On /products/3 the Products link is no longer highlighted: by default the match is a prefix match.',
        solution: `<a routerLink="products" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }">`,
      },
      {
        task: "Predict first, then try: move the `'**'` route to the top of `children` and open /products/2.",
        expect:
          '"Nothing here": routes are matched in order and `**` matches everything, so no route after it is ever reached.',
        solution: `// The wildcard must be the last child.
{ path: '**', title: pageTitle('Not found'), component: MissingView },`,
      },
    ],
  },

  params: {
    files: ['demos/views/product-detail.ts'],
    tasks: [
      {
        task: "Read the id the older way too: `toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('id'))))`, and show it next to the input.",
        expect:
          'Both show the same id, and both follow Previous / Next. The input binding is the shorter way.',
        solution: `// product-detail.ts (import toSignal and map)
protected readonly idFromRoute = toSignal(
  this.route.paramMap.pipe(map((params) => params.get('id'))),
);
<!-- template --> <p>From ActivatedRoute: {{ idFromRoute() }}</p>`,
      },
      {
        task: 'Add a `highlight` query param input with `booleanAttribute`, and give the product name a class when it is true. Open /products/2?highlight=true.',
        expect:
          'The name gets the class only with `?highlight=true` in the URL; without it the input is false.',
        solution: `readonly highlight = input(false, { transform: booleanAttribute });
<!-- template -->
<h3 class="product-name" [class.is-active]="highlight()">{{ product().name }}</h3>`,
      },
      {
        task: 'Predict first, then try: change `id` to `input.required<number>()` (no transform) and look at the hint line.',
        expect:
          'It compiles, but the hint says "(string)": route params are always strings, whatever the TypeScript type says. That is what `numberAttribute` fixed.',
        solution: `readonly id = input.required({ transform: numberAttribute });`,
      },
    ],
  },

  guards: {
    files: ['07-routing.routes.ts', 'demos/guards.ts'],
    tasks: [
      {
        task: 'Protect the `edit` route with `authGuard` too, then open "Edit profile" while logged out.',
        expect:
          'You land on the login view with `returnUrl` pointing at /edit, and "Log in" takes you there.',
        solution: `{
  path: 'edit',
  title: pageTitle('Edit profile'),
  canActivate: [authGuard],
  canDeactivate: [unsavedChangesGuard],
  component: EditView,
},`,
      },
      {
        task: 'Predict first, then try: make `authGuard` return `false` instead of the UrlTree, and click "navigateByUrl(\'…/admin\')" in the last card.',
        expect:
          'Nothing moves and the promise resolves to false. A `false` just cancels; a UrlTree (or RedirectCommand) cancels and sends the user somewhere useful.',
        solution: `return inject(Router).createUrlTree([ROUTING_URL, 'login'], {
  queryParams: { returnUrl: state.url },
});`,
      },
    ],
  },

  resolvers: {
    files: ['demos/product-resolvers.ts', '07-routing.routes.ts', 'demos/views/product-detail.ts'],
    tasks: [
      {
        task: 'Set `RESOLVE_DELAY_MS` to 2000 and click between products.',
        expect:
          'The old product stays on screen with "Navigating…" for two seconds: the route only activates once its resolvers finish.',
        solution: `export const RESOLVE_DELAY_MS = 2000;`,
      },
      {
        task: 'Add a second resolver, `relatedResolver`, that returns the names of the other products, register it as `related`, and list them in the detail view.',
        expect:
          'The detail shows "Also see: …" with the other three names. Each key of `resolve` becomes an input.',
        solution: `// product-resolvers.ts
export const relatedResolver: ResolveFn<string[]> = (route) => {
  const id = Number(route.paramMap.get('id'));
  return PRODUCTS.filter((p) => p.id !== id).map((p) => p.name);
};

// routes: resolve: { product: productResolver, related: relatedResolver },

// product-detail.ts
readonly related = input<string[]>([]);
<!-- template --> <p>Also see: {{ related().join(', ') }}</p>`,
      },
      {
        task: 'Predict first, then try: in `productResolver`, move `const router = inject(Router);` below the `await`.',
        expect:
          'Clicking a product does nothing and the console shows NG0203 "The `_Router` token injection failed": after an `await` the injection context is gone.',
        solution: `const router = inject(Router);   // first, before any await
const id = Number(route.paramMap.get('id'));
await new Promise((resolve) => setTimeout(resolve, RESOLVE_DELAY_MS));`,
      },
    ],
  },

  redirects: {
    files: ['07-routing.routes.ts'],
    tasks: [
      {
        task: "Add `{ path: 'shop', redirectTo: 'products', pathMatch: 'full' }` and type /shop in the address bar.",
        expect:
          'The address bar ends on /products: the redirect happens before any component is created.',
        solution: `{ path: 'shop', redirectTo: 'products', pathMatch: 'full' },`,
      },
      {
        task: "Predict first, then try: remove `pathMatch: 'full'` from the empty-path redirect and open the topic.",
        expect:
          'The topic does not open: NG04014 "Invalid configuration of route ... please provide \'pathMatch\'". An empty path is a prefix of every URL, so Angular makes you choose.',
        solution: `{ path: '', redirectTo: 'products', pathMatch: 'full' },`,
      },
    ],
  },

  programmatic: {
    files: ['demos/programmatic-nav-demo.ts'],
    tasks: [
      {
        task: "Add a button that navigates to `['products', 99]` relative to the route.",
        expect:
          'You end on the product list with the "does not exist" notice: the resolver returned a RedirectCommand. The promise still resolves to true, for the redirected navigation.',
        solution: `protected toMissing(): void {
  this.track(this.router.navigate(['products', 99], { relativeTo: this.route }));
}`,
      },
      {
        task: "Pass `replaceUrl: true` to the first button's navigation. Open the list, click that button, then `location.back()`.",
        expect:
          'Back skips the product page and goes to whatever came before the list: the product replaced the list entry in the history instead of adding one.',
        solution: `this.router.navigate(['products', 1], { relativeTo: this.route, replaceUrl: true })`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
