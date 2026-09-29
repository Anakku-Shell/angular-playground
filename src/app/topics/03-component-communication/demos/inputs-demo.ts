import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ProgressBar } from './inputs/progress-bar';

@Component({
  selector: 'app-inputs-demo',
  imports: [ProgressBar],
  templateUrl: './inputs-demo.html',
  styleUrl: './inputs-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputsDemo {
  protected readonly uploaded = signal(90);
  protected readonly striped = signal(false);

  protected onUploaded(event: Event): void {
    this.uploaded.set(Number((event.target as HTMLInputElement).value));
  }
}
