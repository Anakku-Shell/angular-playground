import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  KeyValuePipe,
  UpperCasePipe,
} from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-pipes-demo',
  // Each pipe is imported where it is used, like components.
  imports: [AsyncPipe, CurrencyPipe, DatePipe, JsonPipe, KeyValuePipe, UpperCasePipe],
  templateUrl: './pipes-demo.html',
  styles: '.kv + .kv { margin-left: 0.75rem; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipesDemo {
  protected readonly launch = new Date(2026, 0, 15, 9, 30);
  protected readonly price = 1234.5;
  protected readonly title = 'angular playground';
  protected readonly settings = { theme: 'dark', fontSize: 14, beta: true };
  protected readonly scores = { carol: 7, alice: 12, bob: 9 };
  // A new Date every second. The async pipe subscribes, and unsubscribes when the component is destroyed.
  protected readonly clock$ = interval(1000).pipe(
    startWith(0),
    map(() => new Date()),
  );
}
