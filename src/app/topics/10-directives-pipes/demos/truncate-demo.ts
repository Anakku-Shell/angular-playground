import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TruncatePipe } from '../pipes/truncate-pipe';

const TEXT =
  'Pipes transform a value for display without changing the value itself, and they can take arguments.';

/** A custom pipe with optional arguments. */
@Component({
  selector: 'app-truncate-demo',
  imports: [TruncatePipe],
  template: `
    <label class="demo-row">
      Limit: <strong>{{ limit() }}</strong>
      <input
        type="range"
        class="limit"
        min="5"
        max="100"
        [value]="limit()"
        (input)="setLimit($event)"
      />
    </label>
    <dl class="demo-values">
      <dt><code>text | truncate</code></dt>
      <dd class="default-args">{{ text | truncate }}</dd>
      <dt><code>text | truncate: limit()</code></dt>
      <dd class="one-arg">{{ text | truncate: limit() }}</dd>
      <dt><code>text | truncate: limit() : ' [more]'</code></dt>
      <dd class="two-args">{{ text | truncate: limit() : ' [more]' }}</dd>
    </dl>
  `,
  styleUrl: './directives-demo.scss',
  styles: `
    .demo-values {
      margin-top: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruncateDemo {
  protected readonly text = TEXT;
  protected readonly limit = signal(30);

  protected setLimit(event: Event): void {
    this.limit.set(Number((event.target as HTMLInputElement).value));
  }
}
