import { routes } from './app.routes';
import { TOPICS } from './topics/topics.registry';

describe('app routes', () => {
  it('has one route per topic, between home and the wildcard', () => {
    expect(routes.length).toBe(TOPICS.length + 2);
    expect(routes[0].path).toBe('');
    expect(routes.at(-1)?.path).toBe('**');
  });

  it('uses unique topic ids and paths, numbered in order', () => {
    const ids = TOPICS.map((topic) => topic.id);
    expect(new Set(TOPICS.map((topic) => topic.path)).size).toBe(TOPICS.length);
    expect(ids).toEqual(TOPICS.map((_, index) => String(index + 1).padStart(2, '0')));
    for (const topic of TOPICS) expect(topic.path.startsWith(`${topic.id}-`)).toBe(true);
  });

  // The lazy imports only run when a route is visited; this catches a broken import or a
  // renamed export without clicking through the app.
  it.each(routes.map((route) => [route.path, route] as const))(
    'lazy-loads /%s',
    async (_path, route) => {
      if (route.loadComponent) {
        const component = await route.loadComponent();
        expect(typeof component).toBe('function');
      } else {
        // Either a Routes array or an NgModule class (topic 13).
        const children = await route.loadChildren?.();
        const isRoutes = Array.isArray(children) && children.length > 0;
        expect(isRoutes || typeof children === 'function').toBe(true);
      }
    },
  );
});
