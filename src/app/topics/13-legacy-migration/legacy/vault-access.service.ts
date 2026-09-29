import { Injectable } from '@angular/core';

/** LEGACY state holder: a plain mutable field, read by the guard and the topic page. */
@Injectable({ providedIn: 'root' })
export class VaultAccessService {
  unlocked = false;
}
