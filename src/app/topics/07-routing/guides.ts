import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files. Every card drives the mini app at the top of the page.
 */
export const GUIDES = {
  childRoutes: {
    label: 'Child routes',
    question: 'show pages inside a page, each with its own URL',
    use: '`children` + a nested `<router-outlet>`',
    why: 'A section of an app often has its own pages: a product list, a product detail, an admin area. Child routes give each one a URL under the section, and a nested `<router-outlet>` decides where they render.',
    steps: [
      {
        action: 'In the mini app, click "Products", then a product.',
        result:
          'The real browser URL changes to `/topics/07-routing/products/…` and the view inside the mini app changes. The rest of the page stays: only the nested outlet swaps its component.',
      },
      {
        action: "Type `/products/3` in the mini app's address bar and press Go.",
        result:
          "The router finds the route from the URL alone. Every view can be reached by its URL, and the browser's back and forward buttons work.",
      },
      {
        action: "Look at the mini app's nav while a product is open.",
        result: '"Products" stays highlighted: `routerLinkActive` matches by prefix.',
      },
    ],
    snippet: `// 07-routing.routes.ts
{
  path: '',
  component: RoutingPage,                  // its template has a <router-outlet>
  children: [
    { path: 'products', component: ProductList },
    { path: 'products/:id', component: ProductDetail },
  ],
}

<!-- a link -->
<a routerLink="products" routerLinkActive="is-active">Products</a>`,
    read: [
      {
        file: '07-routing.routes.ts',
        lookFor: '[1] the parent route, [2] its children.',
      },
      {
        file: 'demos/mini-app.html',
        lookFor: 'The nav with `routerLink`, and the nested `<router-outlet>`.',
      },
      {
        file: 'demos/mini-app.ts',
        lookFor: 'The address bar: it reads the URL from the router events.',
      },
    ],
  },

  params: {
    label: 'Params as inputs',
    question: 'read values from the URL (/products/2, ?sort=price)',
    use: '`withComponentInputBinding()` + `input()`',
    why: 'A detail page needs the id in the URL, and a list its sort order. With input binding the router sets them as inputs of the component, the same way a parent would.',
    steps: [
      {
        action: 'Click "products/2" below.',
        result:
          'The detail shows Mouse and "input: 2 (number)": the `:id` param arrived as the string "2" and a transform turned it into a number.',
      },
      {
        action: 'Click "Next →" in the mini app a few times.',
        result:
          'The URL and the product change, but the component is the same instance: only its inputs change.',
      },
      {
        action: 'Click "products?sort=price", then "products?sort=name".',
        result:
          'The list re-sorts. `?sort=` is bound to the `sort` input, and the hint shows its value.',
      },
    ],
    snippet: `// app.config.ts
provideRouter(routes, withComponentInputBinding())

// route: { path: 'products/:id', component: ProductDetail }
export class ProductDetail {
  readonly id = input.required({ transform: numberAttribute });   // from :id
}

export class ProductList {
  readonly sort = input<string>();                                 // from ?sort=
}`,
    read: [
      {
        file: 'demos/views/product-detail.ts',
        lookFor: '[1] the `id` input, [2] the `product` input filled by the resolver.',
      },
      {
        file: 'demos/views/product-list.ts',
        lookFor: 'The `sort` input, and the links that change only the query params.',
      },
      {
        file: '../../app.config.ts',
        lookFor: '`withComponentInputBinding()`: the line that turns all this on.',
      },
    ],
  },

  guards: {
    label: 'Guards',
    question: 'stop a navigation (not logged in, unsaved changes)',
    use: '`canActivate`, `canDeactivate`',
    why: 'Some pages need permission, and some should not be left with unsaved work. Guards are functions the router runs before entering or leaving a route: they allow it, block it or redirect it.',
    steps: [
      {
        action: 'Untick "Logged in" in the mini app, then click "admin" below.',
        result:
          'You land on the login page, and the URL has `?returnUrl=…`: the guard answered with a redirect.',
      },
      {
        action: 'Click "Log in".',
        result: 'You reach the admin page: the login view navigated back to `returnUrl`.',
      },
      {
        action: 'Click "edit", change the name, then click "Products" in the mini app.',
        result:
          'The guard asks before leaving. "Stay" cancels the navigation; "Leave" lets it go on.',
      },
    ],
    snippet: `export const authGuard: CanActivateFn = () =>
  inject(FakeAuth).loggedIn() || inject(Router).createUrlTree(['/login']);

{ path: 'admin', component: AdminView, canActivate: [authGuard] }
{ path: 'edit', component: EditView, canDeactivate: [unsavedChangesGuard] }`,
    read: [
      {
        file: 'demos/guards.ts',
        lookFor: '[1] `authGuard`, [2] `unsavedChangesGuard`.',
      },
      {
        file: 'demos/views/login-view.ts',
        lookFor: 'Back to `returnUrl` after logging in.',
      },
      {
        file: 'demos/views/edit-view.ts',
        lookFor: '`canLeave()`: the promise the guard waits for.',
      },
    ],
  },

  resolvers: {
    label: 'Resolvers & titles',
    question: 'load data before a page opens, and set the tab title',
    use: '`resolve`, `title`',
    why: 'Sometimes a page should only open once its data is there, or not open at all if the data does not exist. A resolver runs before the route activates and hands its result to the component. Route titles set the browser tab title of each page.',
    steps: [
      {
        action: 'Click "products/3" below.',
        result:
          '"Navigating…" shows for a moment while the router waits for the resolver. Then the detail opens with its data ready, and the tab title says "Monitor".',
      },
      {
        action: 'Click "products/99".',
        result:
          'The resolver finds nothing and redirects to the list, which explains what happened.',
      },
    ],
    snippet: `export const productResolver: ResolveFn<Product> = async (route) => {
  const router = inject(Router);                      // before any await
  const product = await load(route.paramMap.get('id'));
  return product ?? new RedirectCommand(router.parseUrl('/products'));
};

{
  path: 'products/:id',
  component: ProductDetail,
  resolve: { product: productResolver },              // → the product input
  title: productTitleResolver,
}`,
    read: [
      {
        file: 'demos/product-resolvers.ts',
        lookFor: '[1] the data resolver, [2] its redirect, [3] the title resolver.',
      },
      {
        file: '07-routing.routes.ts',
        lookFor: '[3] the route that uses them.',
      },
      {
        file: 'demos/mini-app.ts',
        lookFor: 'The "Navigating…" indicator, from `router.currentNavigation()`.',
      },
    ],
  },

  redirects: {
    label: 'Redirects & 404',
    question: 'send old or empty URLs elsewhere, and catch unknown ones',
    use: '`redirectTo`, `**`',
    why: 'URLs outlive code: an empty path needs a default page, old links must keep working, and typos should land somewhere useful. Redirects and a wildcard route cover all three.',
    steps: [
      {
        action: 'Click "the topic root".',
        result: 'The URL becomes `…/products`: the empty path redirects.',
      },
      {
        action: 'Click "catalog/4".',
        result: 'You land on `products/4`: a redirect function built the new URL from the old one.',
      },
      {
        action: 'Click "does-not-exist".',
        result:
          'The topic\'s own "Nothing here" view, not the app-wide 404: this topic\'s `**` route caught it.',
      },
    ],
    snippet: `children: [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'catalog/:id', redirectTo: ({ params }) => \`products/\${params['id']}\` },
  // ...
  { path: '**', component: MissingView },                // always the last one
]`,
    read: [
      {
        file: '07-routing.routes.ts',
        lookFor: '[4] the empty-path redirect, [5] the redirect function, [6] the wildcard.',
      },
      {
        file: 'demos/views/missing-view.ts',
        lookFor: 'The view the wildcard shows.',
      },
    ],
  },

  programmatic: {
    label: 'Navigating from code',
    question: 'navigate from code, after an action',
    use: '`router.navigate()`, `navigateByUrl()`',
    why: 'Links cover what the user clicks. After an action, like saving a form or logging in, the code has to navigate by itself. The router has two methods for that, and both tell you whether the navigation happened.',
    steps: [
      {
        action: 'Click "navigate([\'products\', 1], relativeTo)".',
        result: 'The mini app opens product 1, and the result is `true`.',
      },
      {
        action: 'Untick "Logged in", then click "navigateByUrl(\'…/admin\')".',
        result:
          'You end up on the login page and the result is still `true`: after a guard redirect, the promise reports the new navigation.',
      },
      {
        action: 'Open "Edit profile", change the name, click any button here and choose "Stay".',
        result: 'The result is `false`: a guard said no.',
      },
    ],
    snippet: `private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

this.router.navigate(['products', 1], { relativeTo: this.route });    // commands
const ok = await this.router.navigateByUrl('/topics/07-routing/admin'); // a full URL
// ok === false: a guard said no`,
    read: [
      {
        file: 'demos/programmatic-nav-demo.ts',
        lookFor:
          '[1] `navigate` with `relativeTo`, [2] with query params, [3] `navigateByUrl`, [4] the result.',
      },
      {
        file: 'demos/views/product-detail.ts',
        lookFor: '[3] Previous and Next navigate relative to the current route.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
