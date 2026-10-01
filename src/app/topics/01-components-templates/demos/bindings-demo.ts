import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-bindings-demo',
  templateUrl: './bindings-demo.html',
  styleUrl: './bindings-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingsDemo {
  // One signal per control. The template reads them with () and writes them with .set().
  // `protected`: visible to this component's template, hidden from other classes.
  // `readonly`: the field always holds the same signal; its value is what changes.
  protected readonly disabled = signal(false);
  protected readonly highlighted = signal(false);
  protected readonly rounded = signal(true);
  protected readonly width = signal(220);
  protected readonly color = signal('#c3002f');

  /**
   * Reads the value of the <input> that fired the event. `event.target` is typed as a generic
   * `EventTarget`, so the cast lives here, in TypeScript, instead of in the template.
   */
  protected valueOf(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
