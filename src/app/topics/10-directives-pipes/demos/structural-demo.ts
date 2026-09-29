import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { HasRole } from '../directives/has-role';
import { ROLES, Session } from '../session';

/** Content shown or hidden by role, with the `*` shorthand and with the explicit ng-template. */
@Component({
  selector: 'app-structural-demo',
  imports: [HasRole],
  template: `
    <fieldset class="choices">
      <legend>Signed in as</legend>
      @for (role of roles; track role) {
        <label>
          <input
            type="radio"
            name="session-role"
            [value]="role"
            [checked]="session.role() === role"
            (change)="session.role.set(role)"
          />
          {{ role }}
        </label>
      }
    </fieldset>

    <p class="box everyone">Everyone sees this.</p>

    <p class="box editor-only" *appHasRole="'editor'; else readOnly">
      <code>*appHasRole="'editor'"</code>: editors and admins can edit.
    </p>
    <ng-template #readOnly>
      <p class="box read-only">Read only: the <code>else</code> template.</p>
    </ng-template>

    <!-- The same directive without the * sugar. -->
    <ng-template [appHasRole]="'admin'">
      <p class="box admin-only">
        <code>&lt;ng-template [appHasRole]="'admin'"&gt;</code>: admin settings.
      </p>
    </ng-template>
  `,
  styleUrl: './directives-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructuralDemo {
  protected readonly session = inject(Session);
  protected readonly roles = ROLES;
}
