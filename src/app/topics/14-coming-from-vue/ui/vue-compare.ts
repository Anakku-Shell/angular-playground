import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RichText } from '../../../shared/rich-text/rich-text';

/** One line of the "Vue → Angular" table. Text between backticks renders as code. */
export interface ComparisonRow {
  readonly vue: string;
  readonly angular: string;
}

/**
 * A side-by-side comparison: a table of equivalences, then the same small example written in Vue
 * and in Angular. Plain data (comparisons.ts), so the code samples need no template escaping.
 */
export interface Comparison {
  readonly rows: readonly ComparisonRow[];
  /** Name of the Vue example, e.g. `Counter.vue`. */
  readonly vueFile: string;
  readonly vue: string;
  readonly angularFile: string;
  readonly angular: string;
}

/** Renders a `Comparison`: the equivalence table and the two code samples. */
@Component({
  selector: 'app-vue-compare',
  imports: [RichText],
  template: `
    <div class="table-scroll">
      <table class="compare__table">
        <thead>
          <tr>
            <th scope="col">Vue 3 (Composition API)</th>
            <th scope="col">Angular 21</th>
          </tr>
        </thead>
        <tbody>
          @for (row of comparison().rows; track $index) {
            <tr>
              <td><app-rich-text [text]="row.vue" /></td>
              <td><app-rich-text [text]="row.angular" /></td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="compare__code">
      <figure>
        <figcaption>Vue · {{ comparison().vueFile }}</figcaption>
        <pre class="compare__vue">{{ comparison().vue }}</pre>
      </figure>
      <figure>
        <figcaption>Angular · {{ comparison().angularFile }}</figcaption>
        <pre class="compare__angular">{{ comparison().angular }}</pre>
      </figure>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      gap: 1rem;
    }

    .table-scroll {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    th,
    td {
      padding: 0.35rem 0.6rem;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--color-border);
    }

    th {
      color: var(--color-text-muted);
      font-weight: 600;
    }

    // Vue column tinted green, Angular column red, like the two logos.
    th:first-child {
      border-bottom: 2px solid #42b883;
    }

    th:last-child {
      border-bottom: 2px solid var(--color-accent);
    }

    // One above the other: side by side, the lines would be cut at the page's width.
    .compare__code {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
    }

    figure {
      margin: 0;
      min-width: 0;
    }

    figcaption {
      margin-bottom: 0.25rem;
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }

    pre {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1.45;
    }

    .compare__vue {
      border-left: 3px solid #42b883;
    }

    .compare__angular {
      border-left: 3px solid var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VueCompare {
  readonly comparison = input.required<Comparison>();
}
