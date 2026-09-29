import { Injectable, signal } from '@angular/core';

export type Role = 'guest' | 'editor' | 'admin';

export const ROLES: readonly Role[] = ['guest', 'editor', 'admin'];

/** A fake signed-in user for the structural directive demo. */
@Injectable({ providedIn: 'root' })
export class Session {
  readonly role = signal<Role>('guest');

  /** Each role includes the permissions of the ones before it. */
  hasRole(required: Role): boolean {
    return ROLES.indexOf(this.role()) >= ROLES.indexOf(required);
  }
}
