import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';

export interface User {
  readonly id: string;
  readonly name: string;
}

export const USERS: readonly User[] = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Grace Hopper' },
  { id: '3', name: 'Alan Turing' },
];

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  template: `
    <ul class="users">
      @for (user of users; track user.id) {
        <li>
          <a [routerLink]="user.id">{{ user.name }}</a>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  protected readonly users = USERS;
}

/** The `:id` route param arrives as an input (`withComponentInputBinding`). */
@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  template: `
    @if (user(); as user) {
      <h3 class="user-name">{{ user.name }}</h3>
    } @else {
      <p class="not-found">No user with id {{ id() }}.</p>
    }
    <a routerLink="..">All users</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  readonly id = input.required<string>();

  protected readonly user = computed(() => USERS.find((user) => user.id === this.id()));
}

/** Routes tested with `RouterTestingHarness`; the page does not mount them. */
export const userRoutes: Routes = [
  { path: '', component: UserList },
  { path: ':id', component: UserDetail },
];
