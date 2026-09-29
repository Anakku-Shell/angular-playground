import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from './highlight.directive';
import { SaveStatusComponent } from './save-status.component';
import { TaskBoardComponent } from './task-board.component';
import { TaskListComponent } from './task-list.component';
import { TaskService } from './task.service';

/**
 * LEGACY feature module (not routed). What each array means:
 * - `declarations`: the components, directives and pipes that belong to this module. Each one is
 *   declared in exactly one module, and its template can use everything declared or imported here.
 * - `imports`: modules whose exports these templates need (`*ngIf`, `async` → CommonModule;
 *   `ngModel`, `ngSubmit` → FormsModule).
 * - `exports`: what an importer (another module or a standalone component) can use in its
 *   templates. `TaskListComponent` and the directive stay private to the module.
 * - `providers`: services added to the injector of whoever imports the module.
 */
@NgModule({
  declarations: [TaskBoardComponent, TaskListComponent, HighlightDirective, SaveStatusComponent],
  imports: [CommonModule, FormsModule],
  exports: [TaskBoardComponent, SaveStatusComponent],
  providers: [TaskService],
})
export class TasksModule {}
