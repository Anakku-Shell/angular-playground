import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map, Observable, timer } from 'rxjs';

/** Fake server latency of the username check. */
export const USERNAME_CHECK_MS = 600;

/** Usernames the fake server says are taken. */
export const TAKEN_USERNAMES = ['angular', 'vue'];

/**
 * Custom sync validator. A factory returns the ValidatorFn so it can take parameters, like the
 * built-in Validators.minLength(3). It returns null when valid, or an errors object.
 */
export function forbiddenValue(forbidden: string): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null =>
    control.value.trim().toLowerCase() === forbidden ? { forbiddenValue: { forbidden } } : null;
}

/**
 * Custom async validator: returns an Observable (or Promise) of errors | null. Angular only runs
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
 * Cross-field validator: it goes on the parent group, the only place that sees both fields. The
 * error lands on the group, not on the controls.
 */
export function fieldsMatch(field: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null =>
    group.get(field)?.value === group.get(confirmField)?.value ? null : { fieldsMismatch: true };
}
