import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { LabeledField } from './queries/labeled-field';
import { Stopwatch } from './queries/stopwatch';

@Component({
  selector: 'app-queries-demo',
  imports: [LabeledField, Stopwatch],
  templateUrl: './queries-demo.html',
  styleUrl: './queries-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesDemo {
  // Query by template reference name (#search). The result is a signal; `.required` makes its
  // type ElementRef instead of ElementRef | undefined.
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  // Query by component type: every <app-stopwatch> in this template, kept up to date as the
  // @for below adds or removes lanes.
  private readonly stopwatches = viewChildren(Stopwatch);

  protected readonly lanes = signal(['Lane 1', 'Lane 2']);
  private nextLane = 3;

  protected readonly runningCount = computed(
    () => this.stopwatches().filter((watch) => watch.running()).length,
  );

  protected focusSearch(): void {
    this.search().nativeElement.focus();
  }

  protected startAll(): void {
    this.stopwatches().forEach((watch) => watch.start());
  }

  protected stopAll(): void {
    this.stopwatches().forEach((watch) => watch.stop());
  }

  protected resetAll(): void {
    this.stopwatches().forEach((watch) => watch.reset());
  }

  protected addLane(): void {
    this.lanes.update((lanes) => [...lanes, `Lane ${this.nextLane++}`]);
  }

  protected removeLane(): void {
    this.lanes.update((lanes) => lanes.slice(0, -1));
  }
}
