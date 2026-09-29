import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Task } from './task';

/** Grandchild: shows one task and reports clicks. It does not change the task itself. */
@Component({
  selector: 'app-task-item',
  template: `
    <label [class.done]="task().done">
      <input type="checkbox" [checked]="task().done" (change)="toggled.emit(task().id)" />
      {{ task().title }}
    </label>
  `,
  styles: `
    .done {
      color: var(--color-text-muted);
      text-decoration: line-through;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly toggled = output<number>();
}
