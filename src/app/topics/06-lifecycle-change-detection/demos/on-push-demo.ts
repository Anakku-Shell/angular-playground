import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';

import { User, UserCard } from './on-push/user-card';

/*
 * changeDetection strategies:
 *   ChangeDetectionStrategy.OnPush   checked only when marked dirty (used everywhere here)
 *   ChangeDetectionStrategy.Eager    checked on every pass (the default; called Default before
 *                                    v21). With OnPush + signals, a pass skips most of the tree.
 */
@Component({
  selector: 'app-on-push-demo',
  imports: [UserCard],
  template: `
    <div class="demo-row">
      <button type="button" (click)="mutate()">Mutate (same object)</button>
      <button type="button" (click)="replace()">Replace (new object)</button>
      <button type="button" (click)="markChild()">markForCheck() on the child</button>
    </div>

    <p class="demo-values">
      Parent shows:
      <strong class="parent-visits">{{ user().name }}, {{ user().visits }} visits</strong>
    </p>
    <app-user-card [user]="user()" />
  `,
  styleUrl: './cd-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushDemo {
  protected readonly user = signal<User>({ name: 'Ada', visits: 0 });

  private readonly card = viewChild.required(UserCard);

  protected mutate(): void {
    // Same reference: the signal is not notified and the child's input does not change.
    // The parent still re-renders because the click happened in its template.
    this.user().visits++;
  }

  protected replace(): void {
    // New reference: the input changes, so the OnPush child is checked.
    this.user.update((user) => ({ ...user, visits: user.visits + 1 }));
  }

  protected markChild(): void {
    this.card().refresh();
  }
}
