import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Task {
  readonly id: number;
  readonly title: string;
}

const INITIAL_TASKS: readonly Task[] = [
  { id: 1, title: 'Read about @for' },
  { id: 2, title: 'Pick a good track key' },
  { id: 3, title: 'Handle the empty list' },
];

@Component({
  selector: 'app-for-demo',
  templateUrl: './for-demo.html',
  styleUrl: './for-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForDemo {
  protected readonly tasks = signal<readonly Task[]>(INITIAL_TASKS);
  private nextId = INITIAL_TASKS.length + 1;

  protected add(): void {
    const id = this.nextId++;
    this.tasks.update((tasks) => [...tasks, { id, title: `Task #${id}` }]);
  }

  protected remove(id: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  protected clear(): void {
    this.tasks.set([]);
  }

  protected reset(): void {
    this.tasks.set(INITIAL_TASKS);
  }
}
