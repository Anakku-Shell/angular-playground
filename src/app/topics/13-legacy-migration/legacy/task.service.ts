import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export type TaskFilter = 'all' | 'open' | 'done';

/**
 * LEGACY: the state lives in a `BehaviorSubject` and components read it with the `async` pipe.
 * Updates replace the array (never mutate it), so OnPush children see a new reference.
 *
 * No `providedIn`: the service is listed in `TasksModule.providers`, as older modules did.
 * Modern: `@Injectable({ providedIn: 'root' })` and a `signal<Task[]>` (topic 11).
 */
@Injectable()
export class TaskService {
  private nextId = 4;
  private readonly tasksSubject = new BehaviorSubject<Task[]>([
    { id: 1, title: 'Read the NgModule docs', done: true },
    { id: 2, title: 'Run the control flow migration', done: false },
    { id: 3, title: 'Replace constructor injection', done: false },
  ]);

  /** Read-only view: consumers cannot call `next()` on it. */
  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  add(title: string): void {
    const task: Task = { id: this.nextId++, title, done: false };
    this.tasksSubject.next([...this.tasksSubject.value, task]);
  }

  toggle(id: number): void {
    this.tasksSubject.next(
      this.tasksSubject.value.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  remove(id: number): void {
    this.tasksSubject.next(this.tasksSubject.value.filter((task) => task.id !== id));
  }
}
