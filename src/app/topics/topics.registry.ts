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
];

/** Router link for a topic page. */
export function topicUrl(topic: Pick<Topic, 'path'>): string {
  return `/topics/${topic.path}`;
}
