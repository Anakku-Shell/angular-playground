import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { HookLog } from './hook-log';

/**
 * Logs each lifecycle hook as it runs. The `implements` clauses are optional (Angular calls the
 * methods by name), but they make TypeScript check the method signatures.
 */
@Component({
  selector: 'app-lifecycle-child',
  template: `
    <strong>{{ label() }}</strong>
    <span class="projected"><ng-content /></span>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 0.75rem;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
    }

    .projected {
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleChild
  implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy
{
  readonly label = input.required<string>();

  private readonly log = inject(HookLog);

  constructor() {
    // [1] Inputs are not set yet: reading label() here is a compile error (NG8118); if it got
    // through, it would throw NG0950 (required input not set) at runtime.
    this.log.add('constructor: injection works, inputs not set yet');
    inject(DestroyRef).onDestroy(() => this.log.add('DestroyRef.onDestroy'));
  }

  // [2] Runs before ngOnInit and again on every input change.
  // SimpleChanges<LifecycleChild> (typed since v21) knows the input names and value types.
  ngOnChanges(changes: SimpleChanges<LifecycleChild>): void {
    const change = changes.label;
    if (change) {
      const from = change.firstChange ? '(first change)' : `"${change.previousValue}"`;
      this.log.add(`ngOnChanges: label ${from} → "${change.currentValue}"`);
    }
  }

  // [3] Once, after the first ngOnChanges: the inputs are set.
  ngOnInit(): void {
    this.log.add(`ngOnInit: inputs are set, label() = "${this.label()}"`);
  }

  // [4] Once each: after the projected content, then after the view, is created.
  ngAfterContentInit(): void {
    this.log.add('ngAfterContentInit: projected content is ready');
  }

  ngAfterViewInit(): void {
    this.log.add('ngAfterViewInit: own view and child views are ready');
  }

  ngOnDestroy(): void {
    this.log.add('ngOnDestroy');
  }
}
