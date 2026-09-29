import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Callout } from './projection/callout';
import { Panel } from './projection/panel';

@Component({
  selector: 'app-projection-demo',
  imports: [Callout, Panel],
  templateUrl: './projection-demo.html',
  styleUrl: './projection-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionDemo {
  protected readonly saved = signal(0);
}
