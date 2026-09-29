import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two-way-demo',
  // ngModel comes from FormsModule. Full forms coverage is in the Forms topic.
  imports: [FormsModule],
  templateUrl: './two-way-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoWayDemo {
  // [(ngModel)] can bind straight to a writable signal (reads it, and calls set() on change).
  protected readonly name = signal('Ada');
}
