import {
  computed,
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Role, Session } from '../session';

/**
 * Structural directive: renders its template only when the user has the role.
 * `<p *appHasRole="'editor'; else readOnly">` is sugar for
 * `<ng-template [appHasRole]="'editor'" [appHasRoleElse]="readOnly"><p>…</p></ng-template>`.
 */
@Directive({ selector: '[appHasRole]' })
export class HasRole {
  readonly appHasRole = input.required<Role>();
  // Microsyntax: `else x` inside the `*` expression becomes the input `appHasRoleElse`.
  readonly appHasRoleElse = input<TemplateRef<unknown> | null>(null);

  // The <ng-template> the directive sits on, and the place to stamp it.
  private readonly template = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly session = inject(Session);

  // computed() only notifies when the result flips, so switching between two roles that are
  // both allowed does not recreate the view (and does not lose its state).
  private readonly allowed = computed(() => this.session.hasRole(this.appHasRole()));

  constructor() {
    effect(() => {
      const template = this.allowed() ? this.template : this.appHasRoleElse();
      this.viewContainer.clear();
      if (template) this.viewContainer.createEmbeddedView(template);
    });
  }
}
