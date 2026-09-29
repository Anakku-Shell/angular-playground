import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-bindings-demo',
  templateUrl: './bindings-demo.html',
  styleUrl: './bindings-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingsDemo {
  protected readonly disabled = signal(false);
  protected readonly highlighted = signal(false);
  protected readonly rounded = signal(true);
  protected readonly width = signal(220);
  protected readonly color = signal('#c3002f');

  /** Reads the value of the <input> that fired the event. */
  protected valueOf(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
