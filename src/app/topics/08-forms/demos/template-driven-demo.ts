import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

/*
 * Three ways to build forms in Angular 21:
 *   template-driven  FormsModule + ngModel; the template declares the controls (this card)
 *   reactive         ReactiveFormsModule; the class builds FormGroup / FormControl (next cards)
 *   signal forms     @angular/forms/signals; experimental, the model is a signal (last card)
 * Every control tracks the same states:
 *   value · valid / invalid / pending · pristine / dirty (changed by the user) ·
 *   untouched / touched (blurred) · enabled / disabled
 * and Angular adds matching CSS classes to the element: ng-valid, ng-invalid, ng-dirty,
 * ng-touched, ng-pending... Style them to show errors without extra bindings.
 */

/** A template-driven form: the template declares the controls with ngModel. */
@Component({
  selector: 'app-template-driven-demo',
  imports: [FormsModule, JsonPipe],
  template: `
    <!-- [1] ngForm is added to every <form> by FormsModule; #f exports it. novalidate turns off the
         browser's own validation bubbles so Angular's messages are the only ones. -->
    <form #f="ngForm" class="demo-form td-form" novalidate (ngSubmit)="save(f)">
      <!-- [2] name + [(ngModel)] registers a control; required / minlength are its rules;
           #nameCtrl="ngModel" exports the control to read its state. -->
      <label class="field">
        <span>Name (required, 3+ characters)</span>
        <input name="name" [(ngModel)]="name" #nameCtrl="ngModel" required minlength="3" />
      </label>
      <!-- [3] Show errors only once the user has left the field (touched). -->
      @if (nameCtrl.invalid && nameCtrl.touched) {
        <p class="error td-name-error">
          @if (nameCtrl.hasError('required')) {
            Name is required.
          } @else {
            At least 3 characters ({{ nameCtrl.value.length }} so far).
          }
        </p>
      }

      <label class="field">
        <span>Email (required, email format)</span>
        <input type="email" name="email" [(ngModel)]="email" #emailCtrl="ngModel" required email />
      </label>
      @if (emailCtrl.invalid && emailCtrl.touched) {
        <p class="error">Enter a valid email.</p>
      }

      <label class="check">
        <input type="checkbox" name="newsletter" [(ngModel)]="newsletter" />
        Send me the newsletter
      </label>

      <div class="demo-row">
        <button type="submit">Save</button>
        <button type="button" (click)="f.resetForm()">Reset</button>
      </div>
    </form>

    <dl class="demo-values">
      <dt>name control</dt>
      <dd class="td-name-state">
        {{ nameCtrl.valid ? 'valid' : 'invalid' }} · {{ nameCtrl.dirty ? 'dirty' : 'pristine' }} ·
        {{ nameCtrl.touched ? 'touched' : 'untouched' }}
      </dd>
      <dt>f.value</dt>
      <dd class="td-value">{{ f.value | json }}</dd>
      <dt>f.valid</dt>
      <dd class="td-valid">{{ f.valid }}</dd>
      <dt>Saved</dt>
      <dd class="td-saved">{{ saved() }}</dd>
    </dl>
  `,
  styleUrl: './forms-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDrivenDemo {
  // [(ngModel)] two-way binds to a WritableSignal as well as to a plain field.
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly newsletter = signal(false);

  protected readonly saved = signal('–');

  // [4] The template passes the form in; the class reads its state and value.
  protected save(f: NgForm): void {
    if (f.invalid) {
      // Submitting marks the form as submitted, not the controls as touched: do it by hand so
      // every error shows up.
      f.form.markAllAsTouched();
      this.saved.set('– (invalid, not saved)');
      return;
    }
    this.saved.set(JSON.stringify(f.value));
  }
}
