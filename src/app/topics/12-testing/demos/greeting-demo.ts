import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Greeting } from '../subjects/greeting';

@Component({
  selector: 'app-greeting-demo',
  imports: [Greeting],
  template: `
    <div class="demo-row">
      <label>
        Name
        <input class="name" [value]="name()" (input)="name.set($any($event.target).value)" />
      </label>
    </div>
    <div class="demo-row">
      <app-greeting [name]="name()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingDemo {
  protected readonly name = signal('Ada');
}
