import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FramedProbe } from './sections/framed-probe';
import { Section } from './sections/section';
import { SectionBox } from './sections/section-box';
import { SectionProbe } from './sections/section-probe';

@Component({
  selector: 'app-modifiers-demo',
  imports: [SectionBox, SectionProbe, FramedProbe],
  template: `
    <p class="outside">
      This demo component, outside every section:
      <code>inject(Section, &#123; optional: true &#125;)</code> →
      <strong class="outside-result">{{ outside?.name() ?? 'null' }}</strong>
    </p>

    <div class="group">
      <app-section-box name="Outer">
        <app-section-box name="Inner">
          <app-section-probe class="direct-probe" />
        </app-section-box>
      </app-section-box>

      <app-section-box name="Frame">
        <app-framed-probe class="framed-probe" />
      </app-section-box>
    </div>
  `,
  styles: `
    .outside {
      margin: 0 0 0.75rem;
    }
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifiersDemo {
  // No Section above this component: without `optional` this line would throw NG0201.
  protected readonly outside = inject(Section, { optional: true });
}
