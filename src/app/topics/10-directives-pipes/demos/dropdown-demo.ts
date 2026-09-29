import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CloseReason, Dropdown } from '../directives/dropdown';

const ACTIONS = ['Rename', 'Duplicate', 'Archive'] as const;

/** A menu whose open state lives in a directive, reached from the template with exportAs. */
@Component({
  selector: 'app-dropdown-demo',
  imports: [Dropdown],
  template: `
    <div class="menu" appDropdown #menu="appDropdown" (closed)="lastClose.set($event)">
      <button
        type="button"
        class="menu-toggle"
        [attr.aria-expanded]="menu.isOpen()"
        (click)="menu.toggle()"
      >
        Actions ▾
      </button>
      @if (menu.isOpen()) {
        <ul class="menu-list">
          @for (action of actions; track action) {
            <li>
              <button type="button" (click)="picked.set(action); menu.close('item picked')">
                {{ action }}
              </button>
            </li>
          }
        </ul>
      }
    </div>
    <p class="hint">
      Picked: <code class="picked">{{ picked() }}</code> · Closed by:
      <code class="close-reason">{{ lastClose() }}</code>
    </p>
    <p class="hint">Open it, then click outside or press Escape.</p>
  `,
  styleUrl: './directives-demo.scss',
  styles: `
    .menu {
      position: relative;
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    .menu-list {
      position: absolute;
      z-index: 5;
      top: calc(100% + 4px);
      left: 0;
      display: grid;
      min-width: 10rem;
      margin: 0;
      padding: 0.25rem;
      list-style: none;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);

      button {
        width: 100%;
        text-align: left;
        border: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemo {
  protected readonly actions = ACTIONS;
  protected readonly picked = signal('–');
  protected readonly lastClose = signal<CloseReason | '–'>('–');
}
