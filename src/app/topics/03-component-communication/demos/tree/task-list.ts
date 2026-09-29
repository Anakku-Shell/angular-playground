import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Task } from './task';
import { TaskItem } from './task-item';

/**
 * Child: sits between the page and the items. It has to declare and forward both directions:
 * the tasks go down to each <app-task-item>, and each item's `toggled` event is re-emitted
 * upwards, because outputs do not bubble.
 */
@Component({
  selector: 'app-task-list',
  imports: [TaskItem],
  template: `
    <h4>{{ heading() }} ({{ doneCount() }}/{{ tasks().length }})</h4>
    <ul>
      @for (task of tasks(); track task.id) {
        <li><app-task-item [task]="task" (toggled)="toggled.emit($event)" /></li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    h4 {
      margin: 0 0 0.25rem;
      font-size: 0.95rem;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  readonly heading = input.required<string>();
  readonly tasks = input.required<readonly Task[]>();
  readonly toggled = output<number>();

  protected readonly doneCount = computed(() => this.tasks().filter((task) => task.done).length);
}
