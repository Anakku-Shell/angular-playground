import { Routes } from '@angular/router';

import { FakeAuth } from './demos/fake-auth';
import { authGuard, unsavedChangesGuard } from './demos/guards';
import { pageTitle, productResolver, productTitleResolver } from './demos/product-resolvers';
import { AdminView } from './demos/views/admin-view';
import { EditView } from './demos/views/edit-view';
import { LoginView } from './demos/views/login-view';
import { MissingView } from './demos/views/missing-view';
import { ProductDetail } from './demos/views/product-detail';
import { ProductList } from './demos/views/product-list';
import { RoutingPage } from './topic-page';

/**
 * Child routes of /topics/07-routing, lazy-loaded by the registry with `loadChildren`.
 * Everything imported here ends up in this topic's lazy chunk.
 *
 * What a route can declare:
 *   path, component | loadComponent | loadChildren | redirectTo, children, pathMatch
 *   title           a string or a ResolveFn<string>
 *   resolve         data loaded before activation, bound to inputs by key
 *   canActivate, canActivateChild, canDeactivate, canMatch   guards
 *   providers       services for this route and its children
 *   data            static data (read with an input or ActivatedRoute.data)
 * Routes are matched in order: the first match wins, so put '**' last.
 */
export const ROUTING_ROUTES: Routes = [
  // [1] The parent route: this topic's page, whose mini app holds the nested <router-outlet>.
  {
    path: '',
    component: RoutingPage,
    // Route-level providers: one FakeAuth for this route, its children and their guards.
    providers: [FakeAuth],
    // [2] The children render in that nested outlet.
    children: [
      // [4] The topic URL itself shows the product list. pathMatch 'full': '' is a prefix of every URL.
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        // Componentless route: it only groups the list and the detail under one URL segment.
        path: 'products',
        children: [
          { path: '', title: pageTitle('Products'), component: ProductList },
          // [3] A route param, a resolver for the data and another one for the title.
          {
            path: ':id',
            title: productTitleResolver,
            resolve: { product: productResolver },
            component: ProductDetail,
          },
        ],
      },
      // [5] Old URL kept alive: redirectTo can be a function that builds the new path.
      { path: 'catalog/:id', redirectTo: ({ params }) => `products/${params['id']}` },
      { path: 'admin', title: pageTitle('Admin'), canActivate: [authGuard], component: AdminView },
      { path: 'login', title: pageTitle('Log in'), component: LoginView },
      {
        path: 'edit',
        title: pageTitle('Edit profile'),
        canDeactivate: [unsavedChangesGuard],
        component: EditView,
      },
      // [6] Wildcard for this topic only. It must be the last child.
      { path: '**', title: pageTitle('Not found'), component: MissingView },
    ],
  },
];
