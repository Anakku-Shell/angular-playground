import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';

import { Section } from './section';

/**
 * [1] A section that provides itself, the pattern behind nested form groups, menus or accordions.
 * `useExisting` points at this component instance; `forwardRef` lets the decorator mention the
 * class before it is defined.
 */
@Component({
  selector: 'app-section-box',
  providers: [{ provide: Section, useExisting: forwardRef(() => SectionBox) }],
  template: `
    <p class="section-head">
      <strong>{{ name() }}</strong>
      <span class="lookups"> parent (skipSelf) → {{ parent?.name() ?? 'null' }} </span>
    </p>
    <ng-content />
  `,
  styles: `
    :host {
      display: grid;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem 0.75rem;
      border: 1px dashed var(--color-border);
      border-radius: var(--radius);
    }

    .section-head {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 0.75rem;
      margin: 0;
    }

    .lookups {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionBox extends Section {
  readonly name = input.required<string>();

  // [2] skipSelf: start at the parent element. Without it the lookup finds this box, which is
  // still being constructed: NG0200 (circular dependency).
  // optional: the outermost box has no parent section, so it gets null instead of an error.
  protected readonly parent = inject(Section, { skipSelf: true, optional: true });
}
