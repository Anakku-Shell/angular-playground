import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SnippetPair } from './snippets';

/** Legacy code next to its modern equivalent. Stacks on narrow screens. */
@Component({
  selector: 'app-code-pair',
  template: `
    <section class="legacy">
      <h3>Legacy</h3>
      <pre><code>{{ pair().legacy }}</code></pre>
    </section>
    <section class="modern">
      <h3>Modern</h3>
      <pre><code>{{ pair().modern }}</code></pre>
    </section>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
      gap: 1rem;
    }

    section {
      min-width: 0;
    }

    h3 {
      margin: 0 0 0.35rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-muted);
    }

    .modern h3 {
      color: var(--color-accent);
    }

    pre {
      margin: 0;
      font-size: 0.8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePair {
  readonly pair = input.required<SnippetPair>();
}
