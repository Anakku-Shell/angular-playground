import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Highlighted box for tips and gotchas. The content (usually a `<ul>`) is
 * projected; the heading and the tone are inputs.
 */
@Component({
  selector: 'app-tips-box',
  templateUrl: './tips-box.html',
  styleUrl: './tips-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Host bindings via metadata (preferred over @HostBinding): the tone becomes a CSS class.
  host: {
    '[class.is-warning]': 'tone() === "warning"',
  },
})
export class TipsBox {
  readonly heading = input('Tips & gotchas');
  readonly tone = input<'tip' | 'warning'>('tip');
}
