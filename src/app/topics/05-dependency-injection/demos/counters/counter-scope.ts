import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Counter } from './counter';

/**
 * `providers: [Counter]` on a component: each `<app-counter-scope>` creates its own Counter,
 * visible to its template and to the content projected into it. It is destroyed with the
 * component.
 */
@Component({
  selector: 'app-counter-scope',
  providers: [Counter],
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterScope {}
