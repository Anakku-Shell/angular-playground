import { Guide } from '../../shared/guide-box/guide';

/**
 * Guided tour of each demo card: why, what to try, the idea in code, and the files to read.
 * The order of the keys is the order of the tabs. `[1]`, `[2]`... in `lookFor` match numbered
 * comments in those files.
 */
export const GUIDES = {
  templateDriven: {
    label: 'Template-driven',
    question: 'build a simple form directly in the template',
    use: '`FormsModule`, `[(ngModel)]`',
    why: 'A form is more than inputs: each field has a value, rules, and a state (valid, touched, changed). Template-driven forms declare all of that in the HTML with `ngModel` and validation attributes, with very little code in the class.',
    steps: [
      {
        action: 'Click into Name, then click outside without typing.',
        result:
          '"Name is required." appears: the control is now touched and invalid. The state row says invalid · pristine · touched.',
      },
      {
        action: 'Type "Ad".',
        result:
          'The message changes to the length rule, and the state becomes dirty. `f.value` updates on every key.',
      },
      {
        action: 'Fill both fields correctly and click Save.',
        result:
          '"Saved" shows the form value. With an invalid form, Save marks every field as touched instead.',
      },
    ],
    snippet: `<form #f="ngForm" (ngSubmit)="save(f)">
  <input name="name" [(ngModel)]="name" #nameCtrl="ngModel" required minlength="3" />
  @if (nameCtrl.invalid && nameCtrl.touched) {
    <p>Name is required, 3+ characters.</p>
  }
  <button type="submit">Save</button>
</form>`,
    read: [
      {
        file: 'demos/template-driven-demo.ts',
        lookFor:
          'The three kinds of form in the header, then [1] the form and its `#f`, [2] a control with its rules, [3] the error message, [4] saving.',
      },
    ],
  },

  reactive: {
    label: 'Reactive',
    question: 'build a typed form in the class and control it from code',
    use: '`FormBuilder`, `[formGroup]`',
    why: 'Bigger forms need logic: fill them from data, change them from code, react to values, test them without a template. Reactive forms build the form model in the class, fully typed, and the template only binds to it.',
    steps: [
      {
        action: 'Click "setValue(all fields)".',
        result:
          'Every field is filled at once. `setValue` needs the complete shape; TypeScript checks it.',
      },
      {
        action: 'Click "setValue(name only)".',
        result: '"Last call" shows the error: `setValue` with a missing field throws.',
      },
      {
        action: 'Click "patchValue(city)", then "Disable age".',
        result:
          'Only the city changes. The disabled age disappears from `form.value` but stays in `getRawValue()`.',
      },
      {
        action: 'Type in Name.',
        result: 'The `valueChanges` row logs every new value: a form is a stream of changes.',
      },
    ],
    snippet: `private readonly fb = inject(NonNullableFormBuilder);
form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  address: this.fb.group({ city: [''] }),
});

<form [formGroup]="form">
  <input formControlName="name" />
  <fieldset formGroupName="address"><input formControlName="city" /></fieldset>
</form>`,
    read: [
      {
        file: 'demos/reactive-profile-demo.ts',
        lookFor:
          '[1] the form model, [2] the template bindings, [3] the bridge to signals, [4] the methods behind the buttons.',
      },
    ],
  },

  formArray: {
    label: 'FormArray',
    question: 'let the user add and remove fields',
    use: '`FormArray`',
    why: 'Some forms have a list whose length the user decides: skills, phone numbers, order lines. A `FormArray` holds a list of controls that can grow and shrink while every item keeps its own value and rules.',
    steps: [
      {
        action: 'Click "Add skill" until it is disabled.',
        result: 'New empty inputs appear, up to 5. `form.value` shows the array growing.',
      },
      {
        action: 'Type in one of the new skills.',
        result: 'Its value appears in its position of `skills`.',
      },
      {
        action: 'Remove every skill.',
        result: '"Add at least one skill." appears: the array itself has a `required` validator.',
      },
    ],
    snippet: `form = this.fb.group({
  skills: this.fb.array([this.fb.control('TypeScript')], Validators.required),
});

this.form.controls.skills.push(this.fb.control(''));   // add
this.form.controls.skills.removeAt(0);                 // remove

<ol formArrayName="skills">
  @for (skill of skills.controls; track skill; let i = $index) {
    <li><input [formControlName]="i" /></li>
  }
</ol>`,
    read: [
      {
        file: 'demos/form-array-demo.ts',
        lookFor:
          '[1] the array in the model, [2] the template that loops over it, [3] add and remove.',
      },
    ],
  },

  validators: {
    label: 'Validators',
    question: 'write your own validation rules (custom, async, cross-field)',
    use: '`ValidatorFn`, `AsyncValidatorFn`',
    why: 'Built-in rules (required, email, minLength) are not always enough: a reserved word, a name already taken on the server, two passwords that must match. A validator is just a function, so you can write your own.',
    steps: [
      {
        action: 'Type "admin" as the username.',
        result: '"admin is reserved": a custom sync validator with a parameter.',
      },
      {
        action: 'Type "angular".',
        result:
          '"Checking availability…" for a moment, then "taken": an async validator that asks a (fake) server. The form status is PENDING while it runs.',
      },
      {
        action: 'Type a password, then a different confirmation.',
        result:
          '"Passwords do not match": a validator on the group, the only place that sees both fields.',
      },
    ],
    snippet: `// a validator is a function: errors object, or null when valid
export function forbiddenValue(word: string): ValidatorFn {
  return (control) => (control.value === word ? { forbiddenValue: { word } } : null);
}

username: ['', [Validators.required, forbiddenValue('admin')], [usernameAvailable()]],
//              sync validators                                  async validators`,
    read: [
      {
        file: 'demos/validators.ts',
        lookFor: '[1] a custom sync validator, [2] an async one, [3] a cross-field one.',
      },
      {
        file: 'demos/validators-demo.ts',
        lookFor: '[1] where each kind is attached, [2] the messages, [3] the PENDING state.',
      },
    ],
  },

  signalForm: {
    label: 'Signal forms',
    question: 'try the new forms API built on signals (experimental)',
    use: '`form()`, `[formField]`',
    why: 'Signal forms are the next forms API: the model is a plain signal, every field state (value, errors, touched) is a signal too, and the rules live in a schema. It is experimental in v21, so expect changes, but it shows where Angular is going.',
    steps: [
      {
        action: 'Type in Email.',
        result: '`model()` changes on every key: the form writes straight into your signal.',
      },
      {
        action: 'Click "model.set(example)".',
        result: 'All inputs update: writing the model updates the form. There is no `setValue`.',
      },
      {
        action: 'Change the confirmation so it differs, then click "Log in".',
        result:
          '"Passwords do not match" and nothing is submitted: `submit()` only runs the action when the form is valid.',
      },
    ],
    snippet: `model = signal({ email: '', password: '' });

loginForm = form(this.model, (path) => {
  required(path.email);
  email(path.email);
  minLength(path.password, 8);
});

<input [formField]="loginForm.email" />
@for (error of loginForm.email().errors(); track error.kind) { {{ error.message }} }`,
    read: [
      {
        file: 'demos/signal-form-demo.ts',
        lookFor: '[1] the model, [2] the schema with its rules, [3] the bindings, [4] submit.',
      },
    ],
  },
} as const satisfies Record<string, Guide>;
