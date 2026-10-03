import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FilterImpurePipe, FilterPurePipe } from '../pipes/filter-pipe';

const NEW_FRUITS = ['banana', 'tangerine', 'mandarin', 'pecan', 'plantain'];

/** The same filter as a pure and as an impure pipe, fed a mutated array and a new one. */
@Component({
  selector: 'app-pure-impure-demo',
  imports: [FilterPurePipe, FilterImpurePipe],
  template: `
    <div class="demo-row">
      <label>
        Filter
        <input type="text" class="term" [value]="term()" (input)="setTerm($event)" />
      </label>
    </div>
    <div class="demo-row">
      <button type="button" (click)="addByPush()">Add with push() (mutation)</button>
      <button type="button" (click)="addAsNewArray()">Add as a new array</button>
      <button type="button" (click)="reset()">Reset</button>
    </div>
    <dl class="demo-values">
      <dt>Array</dt>
      <dd class="all">{{ fruits.join(', ') }}</dd>
      <dt><code>| filterPure</code></dt>
      <dd class="pure">{{ (fruits | filterPure: term()).join(', ') || '–' }}</dd>
      <dt><code>| filterImpure</code></dt>
      <dd class="impure">{{ (fruits | filterImpure: term()).join(', ') || '–' }}</dd>
    </dl>
  `,
  styleUrl: './directives-demo.scss',
  styles: `
    .demo-values {
      margin-top: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PureImpureDemo {
  // A plain array on purpose (not a signal): the demo needs to mutate it in place. The click
  // handlers still mark the component for check, so the template is refreshed.
  protected fruits = ['apple', 'mango', 'orange'];
  protected readonly term = signal('an');
  private added = 0;

  // [1] Mutation: the same array object, one more item.
  protected addByPush(): void {
    this.fruits.push(this.nextFruit());
  }

  // [2] Replacement: a new array object.
  protected addAsNewArray(): void {
    this.fruits = [...this.fruits, this.nextFruit()];
  }

  protected reset(): void {
    this.fruits = ['apple', 'mango', 'orange'];
    this.added = 0;
  }

  protected setTerm(event: Event): void {
    this.term.set((event.target as HTMLInputElement).value);
  }

  private nextFruit(): string {
    return NEW_FRUITS[this.added++ % NEW_FRUITS.length];
  }
}
