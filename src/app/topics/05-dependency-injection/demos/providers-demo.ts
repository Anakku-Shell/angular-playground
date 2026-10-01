import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CounterPanel } from './counters/counter-panel';
import { CounterScope } from './counters/counter-scope';

/*
 * Where a service can be provided, from widest to narrowest:
 *   @Injectable({ providedIn: 'root' })   one instance for the app (lazy, tree-shakable)
 *   appConfig.providers                   one instance for the app (app.config.ts)
 *   a route's providers: [...]            one per route config, for that route and children
 *   a component's providers: [...]        one per component instance, for it and its content
 *   a component's viewProviders: [...]    the same, but only for its own template
 * inject() then walks up from the component that asks and takes the first match.
 */
@Component({
  selector: 'app-providers-demo',
  imports: [CounterPanel, CounterScope],
  template: `
    <section class="group root-group">
      <h3 class="group-title">No providers on the way up: the root instance</h3>
      <app-counter-panel label="Panel A" />
      <app-counter-panel label="Panel B" />
    </section>

    <section class="group scoped-group">
      <h3 class="group-title">Each inside a component with providers: [Counter]</h3>
      <app-counter-scope><app-counter-panel label="Panel C" /></app-counter-scope>
      <app-counter-scope><app-counter-panel label="Panel D" /></app-counter-scope>
    </section>
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvidersDemo {}
