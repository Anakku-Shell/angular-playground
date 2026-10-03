import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

import { Task, TaskFilter, TaskService } from './task.service';

/**
 * LEGACY container component: declared in `TasksModule` (`standalone: false`), constructor
 * injection, a decorator query and a decorator host listener. The topic page shows the modern
 * version of each piece.
 */
@Component({
  selector: 'app-task-board',
  // [1] Required since v19, when standalone became the default. Before v19 this line did not exist.
  standalone: false,
  templateUrl: './task-board.component.html',
  // `styleUrls` (an array) was the only option before v17 added `styleUrl`.
  styleUrls: ['./task-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent {
  // [2] A decorator query. `!`: Angular sets it after the view is created, so it is undefined in the constructor.
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  newTitle = '';
  filter: TaskFilter = 'all';
  readonly filters: TaskFilter[] = ['all', 'open', 'done'];
  readonly tasks$: Observable<Task[]>;

  // [3] Constructor injection. `private` in the parameter list declares the field and assigns it in one go.
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  add(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.taskService.add(title);
    this.newTitle = '';
    this.titleInput.nativeElement.focus();
  }

  toggle(id: number): void {
    this.taskService.toggle(id);
  }

  remove(id: number): void {
    this.taskService.remove(id);
  }

  // [4] Listens on `document` while the component lives; Angular removes the listener on destroy.
  @HostListener('document:keydown.escape')
  clearTitle(): void {
    this.newTitle = '';
  }
}
