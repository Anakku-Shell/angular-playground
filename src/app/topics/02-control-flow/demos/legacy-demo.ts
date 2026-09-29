import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Mode = 'light' | 'dark' | 'system';

interface Item {
  readonly id: number;
  readonly name: string;
}

@Component({
  selector: 'app-legacy-demo',
  // The structural directives are deprecated since v20. Built-in control flow needs no imports.
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './legacy-demo.html',
  styleUrl: './legacy-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyDemo {
  protected readonly loggedIn = signal(true);
  protected readonly modes: readonly Mode[] = ['light', 'dark', 'system'];
  protected readonly mode = signal<Mode>('light');
  protected readonly items: readonly Item[] = [
    { id: 1, name: 'Signals' },
    { id: 2, name: 'Control flow' },
  ];

  // *ngFor takes a function for trackBy; @for takes an expression.
  protected trackById(_index: number, item: Item): number {
    return item.id;
  }
}
