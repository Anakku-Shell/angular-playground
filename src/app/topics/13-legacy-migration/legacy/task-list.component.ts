import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { Task, TaskFilter } from './task.service';

/** LEGACY presentational component: decorator inputs and outputs, derived state in `ngOnChanges`. */
@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnChanges {
  // [1] Plain fields: Angular assigns them before each `ngOnChanges`. Nothing stops the component
  // from reassigning them itself.
  @Input() tasks: Task[] = [];
  @Input() filter: TaskFilter = 'all';

  @Output() toggled = new EventEmitter<number>();
  @Output() removed = new EventEmitter<number>();

  visible: Task[] = [];

  // [2] Runs before the first render and whenever an input gets a new value. Derived state is
  // recomputed by hand here; a `computed()` does it on its own.
  ngOnChanges(): void {
    this.visible =
      this.filter === 'all'
        ? this.tasks
        : this.tasks.filter((task) => task.done === (this.filter === 'done'));
  }

  // `*ngFor` takes a function to track by id; without one it tracks object references.
  trackById(_index: number, task: Task): number {
    return task.id;
  }
}
