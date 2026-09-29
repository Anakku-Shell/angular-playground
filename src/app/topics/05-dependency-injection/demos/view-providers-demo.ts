import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CounterPanel } from './counters/counter-panel';
import { ProvidersBox, ViewProvidersBox } from './counters/scope-boxes';

@Component({
  selector: 'app-view-providers-demo',
  imports: [CounterPanel, ProvidersBox, ViewProvidersBox],
  template: `
    <div class="group">
      <app-providers-box>
        <span box-title>providers: [Counter]</span>
        <app-counter-panel label="Projected" />
      </app-providers-box>

      <app-view-providers-box>
        <span box-title>viewProviders: [Counter]</span>
        <app-counter-panel label="Projected" />
      </app-view-providers-box>
    </div>
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewProvidersDemo {}
