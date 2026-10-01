import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  templateDriven: {
    files: ['demos/template-driven-demo.ts'],
    tasks: [
      {
        task: 'Show errors with CSS only: in the component styles, give `input.ng-invalid.ng-touched` a red border.',
        expect:
          'Leave the name empty and tab out: the border turns red. Angular adds those classes to every control.',
        solution: `styles: \`
  input.ng-invalid.ng-touched {
    border-color: crimson;
  }
\`,`,
      },
      {
        task: 'Add an "Age" field: `type="number"`, `name="age"`, `[(ngModel)]` to a new signal, and the attributes `min="18" max="120"`. Show an error when it is out of range.',
        expect:
          'Typing 12 makes the control invalid with a `min` error, and `f.value` gains an `age` key.',
        solution: `protected readonly age = signal(30);

<input type="number" name="age" [(ngModel)]="age" #ageCtrl="ngModel" min="18" max="120" />
@if (ageCtrl.invalid) {
  <p class="error">Age must be between 18 and 120.</p>
}`,
      },
      {
        task: 'Predict first, then try: remove `name="email"` from the email input.',
        expect:
          "The console shows NG01352 \"If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as 'standalone'\": the name is the control's key in the form.",
        solution: `<input type="email" name="email" [(ngModel)]="email" #emailCtrl="ngModel" required email />`,
      },
    ],
  },

  reactive: {
    files: ['demos/reactive-profile-demo.ts'],
    tasks: [
      {
        task: 'Add a `phone` control (9 digits with `Validators.pattern`) and an input for it. Save and read the error.',
        expect:
          'The build fails in `fillAll()` with TS2345 "Property \'phone\' is missing": `setValue` must receive the whole shape, and TypeScript knows it. Add `phone` there and it compiles.',
        solution: `phone: ['', Validators.pattern(/^\\d{9}$/)],

// fillAll()
this.form.setValue({ name: 'Ada', age: 36, phone: '600000000', address: { city: 'London', zip: '12345' } });

<label class="field"><span>Phone</span><input formControlName="phone" /></label>`,
      },
      {
        task: "Make the name control update the model only when the input loses focus: `name: this.fb.control('', { validators: [...], updateOn: 'blur' })`.",
        expect:
          'While typing, `form.value` and the valueChanges log stay still; they update when you tab out. Useful for expensive validation.',
        solution: `name: this.fb.control('', {
  validators: [Validators.required, Validators.minLength(3)],
  updateOn: 'blur',
}),`,
      },
    ],
  },

  formArray: {
    files: ['demos/form-array-demo.ts'],
    tasks: [
      {
        task: 'Add `Validators.maxLength(3)` to the array validators and show an error when there are more than 3 skills.',
        expect:
          'With 4 skills `skills.valid` turns false: on a FormArray, length validators count items.',
        solution: `skills: this.fb.array([...], [Validators.required, Validators.maxLength(3)]),

@if (skills.hasError('maxlength')) {
  <p class="error">At most 3 skills.</p>
}`,
      },
      {
        task: 'Add a "Move up" button to each skill except the first, using `removeAt` and `insert`.',
        expect: 'The skill moves up, with its value, and `form.value` shows the new order.',
        solution: `protected moveUp(index: number): void {
  const control = this.skills.at(index);
  this.skills.removeAt(index);
  this.skills.insert(index - 1, control);
}

@if (i > 0) {
  <button type="button" (click)="moveUp(i)">Move up</button>
}`,
      },
    ],
  },

  validators: {
    files: ['demos/validators-demo.ts', 'demos/validators.ts'],
    tasks: [
      {
        task: 'Reserve "root" too, by adding a second `forbiddenValue(\'root\')` to the username validators.',
        expect:
          '"root" shows the reserved message, like "admin". Validators compose: each one returns its own error.',
        solution: `username: ['', [Validators.required, forbiddenValue('admin'), forbiddenValue('root')], [usernameAvailable()]],`,
      },
      {
        task: "Run the async check only when the field loses focus, with `updateOn: 'blur'` on the username control.",
        expect:
          '"Checking availability…" no longer flashes on every key; it appears once, after you tab out.',
        solution: `username: this.fb.control('', {
  validators: [Validators.required, forbiddenValue('admin')],
  asyncValidators: [usernameAvailable()],
  updateOn: 'blur',
}),`,
      },
    ],
  },

  signalForm: {
    files: ['demos/signal-form-demo.ts'],
    tasks: [
      {
        task: 'Add a `remember: boolean` field to the model and a checkbox bound with `[formField]="loginForm.remember"`.',
        expect:
          'Ticking it shows `"remember": true` in `model()`: a checkbox binds a boolean field.',
        solution: `interface Login { email: string; password: string; confirm: string; remember: boolean; }
protected readonly model = signal<Login>({ email: '', password: '', confirm: '', remember: false });

<label class="check">
  <input type="checkbox" [formField]="loginForm.remember" /> Remember me
</label>`,
      },
      {
        task: 'Disable the confirm field until the password has 8 characters, with the `disabled` rule: `disabled(path.confirm, ({ valueOf }) => valueOf(path.password).length < 8)`.',
        expect:
          'The confirm input is greyed out, then enables itself as soon as the password is long enough.',
        solution: `import { disabled } from '@angular/forms/signals';

disabled(path.confirm, ({ valueOf }) => valueOf(path.password).length < 8);`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
