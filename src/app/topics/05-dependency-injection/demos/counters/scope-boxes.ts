import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Counter } from './counter';
import { CounterPanel } from './counter-panel';

// Both boxes have the same template: one panel in their own view, plus the projected content.
const template = `
  <p class="box-title"><ng-content select="[box-title]" /></p>
  <app-counter-panel label="In the box's view" />
  <ng-content />
`;

const styles = `
  :host {
    display: grid;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem 0.75rem;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius);
  }

  .box-title {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }
`;

/** `providers`: its view and the projected content see the box's Counter. */
@Component({
  selector: 'app-providers-box',
  imports: [CounterPanel],
  providers: [Counter],
  template,
  styles,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvidersBox {}

/**
 * `viewProviders`: only its own view sees the box's Counter. Projected content keeps looking
 * up from where it was declared, so it gets the next Counter above (here, the root one).
 */
@Component({
  selector: 'app-view-providers-box',
  imports: [CounterPanel],
  viewProviders: [Counter],
  template,
  styles,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewProvidersBox {}
