import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Highlight } from '../directives/highlight';
import { Tooltip } from '../directives/tooltip';

/**
 * A tag that is always highlighted on hover and always has a tooltip. The behavior comes from
 * two existing directives, composed with `hostDirectives` instead of reimplemented.
 */
@Component({
  selector: 'app-tag',
  template: `
    <ng-content />
    <!-- [2] The component can inject its host directives and read their public API. -->
    @if (highlight.hovered()) {
      <span aria-hidden="true">●</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
      padding: 0.15rem 0.6rem;
      border: 1px solid var(--color-border);
      border-radius: 999px;
      cursor: default;
    }
  `,
  hostDirectives: [
    // [1] Inputs of host directives are private unless listed; `name: alias` renames them.
    { directive: Highlight, inputs: ['appHighlight: color'] },
    { directive: Tooltip, inputs: ['appTooltip: hint'] },
  ],
  host: { tabindex: '0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tag {
  protected readonly highlight = inject(Highlight);
}

/** Using the composed component: no directive attributes in sight. */
@Component({
  selector: 'app-host-directives-demo',
  imports: [Tag],
  template: `
    <div class="demo-row">
      <app-tag color="lightblue" hint="Signals are stable since v20.">signals</app-tag>
      <app-tag color="pink" hint="Zoneless is the default in v21.">zoneless</app-tag>
      <app-tag hint="No color input: the Highlight default is used.">standalone</app-tag>
    </div>
    <p class="hint">Hover or focus a tag: highlight and tooltip both come from host directives.</p>
  `,
  styleUrl: './directives-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostDirectivesDemo {}
