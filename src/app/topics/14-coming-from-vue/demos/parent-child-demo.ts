import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { QuantityStepper } from './quantity-stepper';

/*
 * THE PARENT. How it talks to the child (quantity-stepper.ts):
 *
 *   Vue                                          Angular
 *   <QuantityStepper v-model="adults"            <app-quantity-stepper [(value)]="adults"
 *     :max="4"                                     [max]="4"
 *     @limit="onLimit">                            (limit)="onLimit($event)">
 *     Adults                                       Adults
 *   </QuantityStepper>                           </app-quantity-stepper>
 *
 * [ ] sends data down (Vue's :), ( ) listens to events (Vue's @), [( )] is both (Vue's v-model).
 */

/** Two steppers bound to the parent's signals, and a total computed from them. */
@Component({
  selector: 'app-parent-child-demo',
  // The child must be imported to be used in the template. Vue: import QuantityStepper from …
  imports: [QuantityStepper],
  template: `
    <div class="steppers">
      <!-- [1] [(value)]: two-way binding to the parent's signal -->
      <!-- [2] [max]: a prop; [3] (limit): an event, $event is its payload -->
      <app-quantity-stepper [(value)]="adults" [max]="4" (limit)="onLimit('adults', $event)">
        Adults
      </app-quantity-stepper>
      <app-quantity-stepper [(value)]="children" [max]="3" (limit)="onLimit('children', $event)">
        Children
      </app-quantity-stepper>
    </div>

    <dl class="demo-values">
      <dt>adults (parent signal)</dt>
      <dd class="adults">{{ adults() }}</dd>
      <dt>total (parent computed)</dt>
      <dd class="total">{{ total() }}</dd>
      <dt>last (limit) event</dt>
      <dd class="limit-message">{{ limitMessage() }}</dd>
    </dl>
  `,
  styles: `
    .steppers {
      display: grid;
      gap: 0.5rem;
    }

    .demo-values {
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentChildDemo {
  protected readonly adults = signal(2);
  protected readonly children = signal(0);
  protected readonly total = computed(() => this.adults() + this.children());
  protected readonly limitMessage = signal('–');

  protected onLimit(who: string, max: number): void {
    this.limitMessage.set(`At most ${max} ${who}.`);
  }
}
