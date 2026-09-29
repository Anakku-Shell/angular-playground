import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { HeavyWidget } from './defer/heavy-widget';

@Component({
  selector: 'app-defer-demo',
  // Referenced only inside @defer blocks, so it is loaded lazily despite being imported here.
  imports: [HeavyWidget],
  templateUrl: './defer-demo.html',
  styleUrl: './defer-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeferDemo {
  protected readonly visible = signal(true);
  protected readonly ready = signal(false);

  // A loaded @defer block never goes back to its placeholder. To replay the demo, remove the
  // blocks for one tick so Angular destroys them, then render them again from scratch.
  protected replay(): void {
    this.visible.set(false);
    this.ready.set(false);
    setTimeout(() => this.visible.set(true));
  }
}
