import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

/** Most skills the list accepts. */
export const MAX_SKILLS = 5;

/** A FormArray: a list of controls whose length changes at runtime. */
@Component({
  selector: 'app-form-array-demo',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" class="demo-form" novalidate>
      <label class="field">
        <span>Developer</span>
        <input formControlName="developer" />
      </label>

      <!-- [2] formArrayName scopes the controls below to the array; each one binds by its index. -->
      <ol formArrayName="skills" class="skills">
        <!-- track the control object, not $index: removing an item must not move the other
             inputs' DOM (and focus) to a different control. -->
        @for (skill of skills.controls; track skill; let i = $index) {
          <li class="skill">
            <input [formControlName]="i" [attr.aria-label]="'Skill ' + (i + 1)" />
            <button type="button" (click)="remove(i)">Remove</button>
          </li>
        } @empty {
          <li class="muted">No skills</li>
        }
      </ol>
      @if (skills.hasError('required')) {
        <p class="error skills-error">Add at least one skill.</p>
      }

      <div class="demo-row">
        <button type="button" [disabled]="skills.length >= maxSkills" (click)="add()">
          Add skill
        </button>
        <span class="hint">{{ skills.length }} / {{ maxSkills }}</span>
      </div>
    </form>

    <dl class="demo-values">
      <dt>form.value</dt>
      <dd class="array-value">{{ value() | json }}</dd>
      <dt>skills.valid</dt>
      <dd class="array-valid">{{ skills.valid }}</dd>
    </dl>
  `,
  styleUrl: './forms-demo.scss',
  styles: `
    .skills {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding-left: 1.5rem;
    }

    .skill {
      display: flex;
      gap: 0.5rem;

      input {
        flex: 1;
        min-width: 0;
      }
    }

    .muted {
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayDemo {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly maxSkills = MAX_SKILLS;

  protected readonly form = this.fb.group({
    developer: ['Ada'],
    // [1] A FormArray of controls. Array validators check the number of items. required fails on an empty array; minLength(n)
    // would skip it (like an empty string), so "at least one" needs required.
    skills: this.fb.array([this.skill('TypeScript'), this.skill('Angular')], Validators.required),
  });

  protected readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  /** Typed as FormArray<FormControl<string>>. The array object never changes, only its items. */
  protected readonly skills = this.form.controls.skills;

  // [3] The array changes in place: push and removeAt.
  protected add(): void {
    this.skills.push(this.skill());
  }

  protected remove(index: number): void {
    this.skills.removeAt(index);
  }

  private skill(name = '') {
    return this.fb.control(name, Validators.required);
  }
}
