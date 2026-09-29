import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Tooltip } from '../directives/tooltip';

/** The same directive on a button, an icon-only button and a plain element. */
@Component({
  selector: 'app-tooltip-demo',
  imports: [Tooltip],
  template: `
    <div class="demo-row">
      <button type="button" class="save" appTooltip="Saves the draft. Nothing is sent yet.">
        Save
      </button>
      <button type="button" aria-label="Delete" appTooltip="Delete (no undo)">✕</button>
      <!-- tabindex makes a non-interactive element focusable, so keyboard users get it too. -->
      <code tabindex="0" appTooltip="Any element can host a directive.">&lt;code&gt;</code>
    </div>
    <p class="hint">Hover, or focus with Tab (Escape hides it).</p>
  `,
  styleUrl: './directives-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemo {}
