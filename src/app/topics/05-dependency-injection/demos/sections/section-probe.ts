import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Section } from './section';

/** Looks up Section four ways. Every lookup is optional, so a miss shows null. */
@Component({
  selector: 'app-section-probe',
  template: `
    <dl class="probe-lookups">
      <dt>inject(Section)</dt>
      <dd class="default">{{ nearest?.name() ?? 'null' }}</dd>
      <dt>&#123; self: true &#125;</dt>
      <dd class="self">{{ self?.name() ?? 'null' }}</dd>
      <dt>&#123; skipSelf: true &#125;</dt>
      <dd class="skip-self">{{ skipSelf?.name() ?? 'null' }}</dd>
      <dt>&#123; host: true &#125;</dt>
      <dd class="host">{{ host?.name() ?? 'null' }}</dd>
    </dl>
  `,
  styles: `
    :host {
      display: block;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      font-size: 0.85rem;
    }

    .probe-lookups {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.2rem 1rem;
      margin: 0;
    }

    dt {
      white-space: nowrap;
      font-family: var(--font-mono);
      color: var(--color-text-muted);
    }

    dd {
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionProbe {
  // `optional` is what makes a miss return null; without it a miss throws NG0201.
  protected readonly nearest = inject(Section, { optional: true });
  protected readonly self = inject(Section, { self: true, optional: true });
  protected readonly skipSelf = inject(Section, { skipSelf: true, optional: true });
  // host: stop at the host element of the template this probe is declared in.
  protected readonly host = inject(Section, { host: true, optional: true });
}
