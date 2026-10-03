import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Single-slot projection: everything the parent writes between <app-callout> and </app-callout>
 * goes into the one <ng-content>. The callout draws the frame; the parent supplies the content.
 * Read this file first, then projection/panel.html.
 */
@Component({
  selector: 'app-callout',
  template: `
    <span class="icon" aria-hidden="true">i</span>
    <div class="content"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-left: 4px solid var(--color-accent);
      border-radius: var(--radius);
      background: var(--color-accent-soft);
    }

    .icon {
      display: grid;
      place-items: center;
      flex: none;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: var(--color-accent);
      color: var(--color-surface);
      font-weight: bold;
    }

    .content {
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Callout {}
