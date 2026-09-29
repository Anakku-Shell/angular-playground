import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// Emulated (the default): Angular rewrites `.enc-sample` to `.enc-sample[_ngcontent-xyz]`,
// so the rule only matches elements from this component's template.
@Component({
  selector: 'app-emulated-sample',
  template: `
    <p class="enc-sample">Emulated (default)</p>
    <button type="button">Global button style</button>
  `,
  styles: `
    :host {
      display: block;
      padding: 0.75rem;
      border: 2px solid var(--color-border);
      border-radius: var(--radius);
    }

    .enc-sample {
      margin-top: 0;
      color: var(--color-accent);
      font-weight: 700;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmulatedSample {}
