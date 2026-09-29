import { Routes } from '@angular/router';

import { TOPICS } from './topics/topics.registry';

export const APP_TITLE = 'Angular Playground';

export const routes: Routes = [
  {
    path: '',
    title: APP_TITLE,
    // Lazy-loaded: the page ends up in its own chunk, fetched on first visit.
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  // One lazy route per registered topic, e.g. /topics/01-components-templates.
  ...TOPICS.map((topic): Routes[number] => ({
    path: `topics/${topic.path}`,
    title: `${topic.title} · ${APP_TITLE}`,
    loadComponent: topic.loadComponent,
    loadChildren: topic.loadChildren,
  })),
  {
    // Wildcard: must stay last, the router matches routes in order.
    path: '**',
    title: `Page not found · ${APP_TITLE}`,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
