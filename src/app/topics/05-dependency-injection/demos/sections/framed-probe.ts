import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SectionProbe } from './section-probe';

/**
 * A component with a probe in its own template. For that probe the host element is
 * `<app-framed-probe>`, which provides no Section, so `host: true` stops there and gets null.
 */
@Component({
  selector: 'app-framed-probe',
  imports: [SectionProbe],
  template: `<app-section-probe />`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FramedProbe {}
