import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// None: the styles are added to the page as-is, so `.enc-sample` becomes a global rule
// that hits every element with that class while this component is on the page.
// `:host` has no meaning without encapsulation, so the host is styled through a class.
@Component({
  selector: 'app-none-sample',
  template: `
    <p class="enc-sample">None: my rule leaks everywhere</p>
    <button type="button">Global button style</button>
  `,
  styles: `
    .none-sample-host {
      display: block;
      padding: 0.75rem;
      border: 2px dashed var(--color-warning);
      border-radius: var(--radius);
    }

    .enc-sample {
      margin-top: 0;
      text-decoration: underline wavy var(--color-warning);
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'none-sample-host' },
})
export class NoneSample {}
