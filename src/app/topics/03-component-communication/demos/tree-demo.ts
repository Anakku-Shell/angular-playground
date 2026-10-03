import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { Task } from './tree/task';
import { TaskList } from './tree/task-list';

const INITIAL_TASKS: readonly Task[] = [
  { id: 1, title: 'Read the docs', done: true },
  { id: 2, title: 'Write a component', done: false },
  { id: 3, title: 'Add a test', done: false },
  { id: 4, title: 'Buy groceries', done: false },
  { id: 5, title: 'Call the bank', done: true },
];

/**
 * THE PARENT of the tree demo: owns the state. Children only display it and report events.
 * This is the only place where a task changes.
 */
@Component({
  selector: 'app-tree-demo',
  imports: [TaskList],
  templateUrl: './tree-demo.html',
  styleUrl: './tree-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeDemo {
  private readonly tasks = signal(INITIAL_TASKS);

  protected readonly workTasks = computed(() => this.tasks().filter((task) => task.id <= 3));
  protected readonly homeTasks = computed(() => this.tasks().filter((task) => task.id > 3));
  protected readonly remaining = computed(() => this.tasks().filter((task) => !task.done).length);
  protected readonly lastEvent = signal('none yet');

  protected onToggled(list: string, id: number): void {
    // Immutable update: a new array and a new object for the changed task, so every input
    // that receives them sees a new reference.
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
    this.lastEvent.set(`task ${id}: app-task-item → app-task-list (${list}) → app-tree-demo`);
  }
}
