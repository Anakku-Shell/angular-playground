import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// ShadowDom: the template is rendered inside a real shadow root. These styles do not get
// out, and the global stylesheet (styles.scss) does not get in: the button loses the
// global look. Inherited properties (font, color) and CSS custom properties still cross.
// Gotcha: Angular copies the styles of its other components into every shadow root, so
// a ViewEncapsulation.None rule does reach in (tick the checkbox to see it).
@Component({
  selector: 'app-shadow-sample',
  template: `
    <p class="enc-sample">ShadowDom</p>
    <button type="button">Global button style</button>
  `,
  styles: `
    :host {
      display: block;
      padding: 0.75rem;
      border: 2px solid var(--color-accent);
      border-radius: var(--radius);
    }

    .enc-sample {
      margin-top: 0;
      font-style: italic;
    }
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShadowSample {}
