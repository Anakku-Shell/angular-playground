import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map, Observable, timer } from 'rxjs';

/*
 * Built-in validators: Validators.required, requiredTrue, min, max, minLength, maxLength,
 * pattern, email. A validator is just a function (control) => ValidationErrors | null, so a
 * custom one is a function too. Template-driven forms use the same ones as attributes
 * (required, minlength="3", email...).
 */

/** Fake server latency of the username check. */
export const USERNAME_CHECK_MS = 600;

/** Usernames the fake server says are taken. */
export const TAKEN_USERNAMES = ['angular', 'vue'];

/**
 * [1] Custom sync validator. A factory returns the ValidatorFn so it can take parameters, like the
 * built-in Validators.minLength(3). It returns null when valid, or an errors object.
 */
export function forbiddenValue(forbidden: string): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null =>
    control.value.trim().toLowerCase() === forbidden ? { forbiddenValue: { forbidden } } : null;
}

/**
 * [2] Custom async validator: returns an Observable (or Promise) of errors | null. Angular only runs
 * it when every sync validator passes, and cancels the previous check on each new value.
 */
export function usernameAvailable(): AsyncValidatorFn {
  return (control: AbstractControl<string>): Observable<ValidationErrors | null> =>
    timer(USERNAME_CHECK_MS).pipe(
      map(() =>
        TAKEN_USERNAMES.includes(control.value.trim().toLowerCase())
          ? { usernameTaken: true }
          : null,
      ),
    );
}

/**
 * [3] Cross-field validator: it goes on the parent group, the only place that sees both fields. The
 * error lands on the group, not on the controls.
 */
export function fieldsMatch(field: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null =>
    group.get(field)?.value === group.get(confirmField)?.value ? null : { fieldsMismatch: true };
}
