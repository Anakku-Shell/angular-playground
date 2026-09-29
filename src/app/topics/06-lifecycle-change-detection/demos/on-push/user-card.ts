import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
} from '@angular/core';

export interface User {
  name: string;
  visits: number;
}

/**
 * An OnPush child. Angular checks it only when it is marked dirty: a new input value
 * (compared by reference), an event in its own template, a signal it reads, or markForCheck().
 */
@Component({
  selector: 'app-user-card',
  template: `
    <span>
      Child shows:
      <strong class="child-visits">{{ user().name }}, {{ user().visits }} visits</strong>
    </span>
    <button type="button" (click)="onClick()">Event in the child</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem 1rem;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  readonly user = input.required<User>();

  private readonly cdr = inject(ChangeDetectorRef);

  /** Marks this view (and its ancestors) to be checked in the next change detection run. */
  refresh(): void {
    this.cdr.markForCheck();
  }

  protected onClick(): void {
    // Nothing to do: an event bound in this template already marks the view for check.
  }
}
