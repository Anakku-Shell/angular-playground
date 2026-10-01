import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

interface Login {
  email: string;
  password: string;
  confirm: string;
}

/*
 * Signal forms in short: form(modelSignal, schema) returns a field tree that mirrors the model.
 *   loginForm.email            a field;  loginForm.email()  its state
 *   state.value() / valid() / errors() / touched() / dirty() / disabled()   all signals
 *   [formField]="loginForm.email"   binds an input
 * Rules live in the schema: required, email, min, max, minLength, maxLength, pattern,
 * validate (custom), disabled, hidden, readonly...
 */

/** Signal forms (experimental in v21): the model is a signal and every field state is a signal. */
@Component({
  selector: 'app-signal-form-demo',
  imports: [FormField, JsonPipe],
  template: `
    <form class="demo-form signal-form" novalidate (submit)="onSubmit($event)">
      <label class="field">
        <span>Email</span>
        <!-- [formField] binds the input to a field of the tree: value, touched, disabled... -->
        <input type="email" class="sf-email" [formField]="loginForm.email" />
      </label>
      @if (loginForm.email().touched()) {
        @for (error of loginForm.email().errors(); track error.kind) {
          <p class="error sf-email-error">{{ error.message }}</p>
        }
      }

      <label class="field">
        <span>Password</span>
        <input type="password" class="sf-password" [formField]="loginForm.password" />
      </label>
      @if (loginForm.password().touched()) {
        @for (error of loginForm.password().errors(); track error.kind) {
          <p class="error">{{ error.message }}</p>
        }
      }

      <label class="field">
        <span>Confirm password</span>
        <input type="password" class="sf-confirm" [formField]="loginForm.confirm" />
      </label>
      @if (loginForm.confirm().dirty()) {
        @for (error of loginForm.confirm().errors(); track error.kind) {
          <p class="error sf-confirm-error">{{ error.message }}</p>
        }
      }

      <div class="demo-row">
        <button type="submit">Log in</button>
        <button type="button" (click)="fillExample()">model.set(example)</button>
      </div>
    </form>

    <dl class="demo-values">
      <dt>model()</dt>
      <dd class="sf-model">{{ model() | json }}</dd>
      <dt>loginForm().valid()</dt>
      <dd class="sf-valid">{{ loginForm().valid() }}</dd>
      <dt>Submitted</dt>
      <dd class="sf-result">{{ result() }}</dd>
    </dl>
  `,
  styleUrl: './forms-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormDemo {
  // The model is a plain WritableSignal: the form reads and writes it, it does not copy it.
  protected readonly model = signal<Login>({ email: '', password: '', confirm: '' });

  // form() builds a FieldTree from the model. The schema function declares the rules per path.
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email.' });
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, 8, { message: 'At least 8 characters.' });
    // Cross-field rule: valueOf() reads another field, and the rule re-runs when it changes.
    validate(path.confirm, ({ value, valueOf }) =>
      value() === valueOf(path.password)
        ? null
        : { kind: 'mismatch', message: 'Passwords do not match.' },
    );
  });

  protected readonly result = signal('–');

  protected fillExample(): void {
    // Writing the model updates the inputs: there is no setValue / patchValue.
    this.model.set({ email: 'ada@example.com', password: 'analytical', confirm: 'analytical' });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    // submit() marks every field as touched and only runs the action when the form is valid.
    // The action returns a Promise (usually the server call); resolving to errors would show them
    // on the fields, null means success.
    void submit(this.loginForm, (field) => {
      this.result.set(`Logged in as ${field.email().value()}`);
      return Promise.resolve(null);
    });
  }
}
