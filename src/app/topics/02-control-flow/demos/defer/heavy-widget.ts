import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Stands in for a heavy component (a chart, an editor, a map). It is only referenced inside
 * @defer blocks, so the build puts it in its own lazy chunk.
 */
@Component({
  selector: 'app-heavy-widget',
  template: `
    <p class="loaded">Loaded {{ trigger() }}</p>
    <div class="bars" aria-hidden="true">
      @for (height of bars; track $index) {
        <span [style.height.%]="height"></span>
      }
    </div>
  `,
  styles: `
    .loaded {
      margin: 0 0 0.5rem;
      font-weight: 600;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 3rem;

      span {
        flex: 1;
        border-radius: 2px 2px 0 0;
        background: var(--color-accent);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeavyWidget {
  readonly trigger = input.required<string>();
  protected readonly bars = [40, 65, 30, 85, 55, 95, 70];
}
