import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-events-demo',
  templateUrl: './events-demo.html',
  styleUrl: './events-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsDemo {
  protected readonly lastClick = signal('Click inside the box');
  protected readonly draft = signal('');
  protected readonly items = signal<string[]>(['Learn bindings']);

  // `$event` is the native DOM event: a MouseEvent for (click).
  protected onClick(event: MouseEvent): void {
    this.lastClick.set(`Clicked at x=${event.offsetX}, y=${event.offsetY}`);
  }

  // For (input), `$event` is a plain Event: the value lives on its target.
  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected add(): void {
    const text = this.draft().trim();
    if (text) {
      this.items.update((items) => [...items, text]);
    }
    this.draft.set('');
  }

  protected clear(): void {
    this.draft.set('');
  }
}
