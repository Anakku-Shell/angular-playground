import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-template-refs-demo',
  templateUrl: './template-refs-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateRefsDemo {
  protected readonly greeting = signal('');

  // The template passes the value in: the class never touches the DOM element.
  protected greet(name: string): void {
    this.greeting.set(name.trim() ? `Hello, ${name.trim()}!` : 'Type a name first.');
  }
}
