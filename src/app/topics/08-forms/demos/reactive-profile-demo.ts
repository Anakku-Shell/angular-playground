import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

/** A typed reactive form: the class builds the model, the template only binds to it. */
@Component({
  selector: 'app-reactive-profile-demo',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" class="demo-form profile-form" novalidate>
      <label class="field">
        <span>Name (required, 3+ characters)</span>
        <input formControlName="name" />
      </label>
      @if (form.controls.name.invalid && form.controls.name.touched) {
        <p class="error">Name is required, with at least 3 characters.</p>
      }

      <label class="field">
        <span>Age (18–120)</span>
        <input type="number" formControlName="age" />
      </label>
      @if (form.controls.age.hasError('min') || form.controls.age.hasError('max')) {
        <p class="error">Age must be between 18 and 120.</p>
      }

      <!-- A nested FormGroup: formGroupName scopes the formControlName inside it. -->
      <fieldset formGroupName="address" class="demo-form">
        <legend>Address</legend>
        <label class="field">
          <span>City</span>
          <input formControlName="city" />
        </label>
        <label class="field">
          <span>ZIP (5 digits)</span>
          <input formControlName="zip" />
        </label>
      </fieldset>
    </form>

    <div class="demo-row actions">
      <button type="button" (click)="fillAll()">setValue(all fields)</button>
      <button type="button" (click)="setValueMissing()">setValue(name only)</button>
      <button type="button" (click)="patchCity()">patchValue(city)</button>
      <button type="button" (click)="toggleAge()">
        {{ form.controls.age.disabled ? 'Enable age' : 'Disable age' }}
      </button>
      <button type="button" (click)="form.reset()">reset()</button>
    </div>

    <dl class="demo-values">
      <dt>form.value</dt>
      <dd class="profile-value">{{ value() | json }}</dd>
      <dt>getRawValue()</dt>
      <dd class="profile-raw">{{ form.getRawValue() | json }}</dd>
      <dt>form.status</dt>
      <dd class="profile-status">{{ status() }}</dd>
      <dt>Last call</dt>
      <dd class="profile-result">{{ result() }}</dd>
      <dt>name.valueChanges</dt>
      <dd class="profile-log">{{ nameLog().join(' → ') || '–' }}</dd>
    </dl>
  `,
  styleUrl: './forms-demo.scss',
  styles: `
    fieldset {
      margin: 0;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    .actions {
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveProfileDemo {
  // NonNullableFormBuilder: every control is FormControl<T>, not FormControl<T | null>, and
  // reset() goes back to the initial value instead of null.
  private readonly fb = inject(NonNullableFormBuilder);

  // The type is inferred: FormGroup<{ name: FormControl<string>; age: FormControl<number>; ... }>.
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [30, [Validators.min(18), Validators.max(120)]],
    address: this.fb.group({
      city: [''],
      zip: ['', Validators.pattern(/^\d{5}$/)],
    }),
  });

  // Forms are not signals: bridge the Observables so the zoneless view refreshes on every change,
  // including changes made from code (setValue, reset...).
  protected readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  protected readonly status = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  protected readonly result = signal('–');
  protected readonly nameLog = signal<string[]>([]);

  constructor() {
    // valueChanges emits on every keystroke and on every setValue / patchValue / reset.
    this.form.controls.name.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((name) => this.nameLog.update((log) => [...log.slice(-4), JSON.stringify(name)]));
  }

  protected fillAll(): void {
    // setValue needs the whole shape; TypeScript checks it.
    this.form.setValue({
      name: 'Ada',
      age: 36,
      address: { city: 'London', zip: '12345' },
    });
    this.result.set('setValue: every field replaced');
  }

  protected setValueMissing(): void {
    try {
      // The cast skips the compile-time check to show the runtime one.
      this.form.setValue({ name: 'Grace' } as never);
    } catch (error) {
      this.result.set(`setValue threw: ${(error as Error).message}`);
    }
  }

  protected patchCity(): void {
    // patchValue takes any subset, nested groups included.
    this.form.patchValue({ address: { city: 'Madrid' } });
    this.result.set('patchValue: only address.city changed');
  }

  protected toggleAge(): void {
    const age = this.form.controls.age;
    if (age.disabled) {
      age.enable();
    } else {
      age.disable();
    }
    this.result.set(`age ${age.disabled ? 'disabled: gone from form.value' : 'enabled'}`);
  }
}
