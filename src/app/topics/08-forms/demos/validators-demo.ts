import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { fieldsMatch, forbiddenValue, TAKEN_USERNAMES, usernameAvailable } from './validators';

/** Built-in, custom sync, async and cross-field validators on a sign-up form. */
@Component({
  selector: 'app-validators-demo',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="demo-form signup-form" novalidate (ngSubmit)="submit()">
      <label class="field">
        <span>Username (not "admin"; taken: {{ taken }})</span>
        <input formControlName="username" class="username" autocomplete="off" />
      </label>
      <!-- [2] One message per error key, checked in order. -->
      @let username = form.controls.username;
      @if (username.pending) {
        <p class="hint username-status">Checking availability…</p>
      } @else if (username.touched || username.dirty) {
        @if (username.hasError('required')) {
          <p class="error username-status">Username is required.</p>
        } @else if (username.hasError('forbiddenValue')) {
          <p class="error username-status">
            "{{ username.getError('forbiddenValue').forbidden }}" is reserved.
          </p>
        } @else if (username.hasError('usernameTaken')) {
          <p class="error username-status">That username is taken.</p>
        } @else {
          <p class="hint username-status">Available.</p>
        }
      }

      <!-- The passwords live in their own group so the cross-field validator sees both. -->
      <div formGroupName="passwords" class="demo-form">
        <label class="field">
          <span>Password (8+ characters)</span>
          <input type="password" formControlName="password" class="password" />
        </label>
        <label class="field">
          <span>Confirm password</span>
          <input type="password" formControlName="confirm" class="confirm" />
        </label>
      </div>
      @let passwords = form.controls.passwords;
      @if (passwords.controls.password.hasError('minlength') && passwords.touched) {
        <p class="error">Password needs at least 8 characters.</p>
      }
      @if (passwords.hasError('fieldsMismatch') && passwords.controls.confirm.dirty) {
        <p class="error mismatch-error">Passwords do not match.</p>
      }

      <div class="demo-row">
        <button type="submit">Sign up</button>
        <span class="hint">
          form status: <code class="signup-status">{{ status() }}</code>
        </span>
      </div>
      <p class="hint signup-result">{{ result() }}</p>
    </form>
  `,
  styleUrl: './forms-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsDemo {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly taken = TAKEN_USERNAMES.join(', ');

  protected readonly form = this.fb.group({
    // [1] [initial value, sync validators, async validators]
    username: ['', [Validators.required, forbiddenValue('admin')], [usernameAvailable()]],
    passwords: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm: [''],
      },
      { validators: fieldsMatch('password', 'confirm') },
    ),
  });

  // [3] The async check finishes outside any template event. Reading this signal in the template is
  // what makes the zoneless view refresh when the status goes from PENDING to VALID / INVALID.
  protected readonly status = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  protected readonly result = signal('');

  protected submit(): void {
    if (this.form.pending) {
      this.result.set('Still checking the username, try again in a moment.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.result.set('Fix the errors above first.');
      return;
    }
    this.result.set(`Welcome, ${this.form.getRawValue().username}!`);
  }
}
