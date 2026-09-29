import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The page behind the class-based guard. Declared in `LegacyModule`, the routed module. */
@Component({
  selector: 'app-vault',
  standalone: false,
  template: `
    <p class="vault">
      You are in: <code>UnlockGuard.canActivate</code> returned <code>true</code>.
    </p>
    <a routerLink="..">Close the vault</a>
  `,
  styles: `
    :host {
      display: block;
      margin-top: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    .vault {
      margin-top: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultComponent {}
