import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, switchMap, takeUntil, timer } from 'rxjs';

const isActivationKey = (event: KeyboardEvent): boolean =>
  (event.key === ' ' || event.key === 'Enter') && !event.repeat;

/** A button that emits `held` only after it is pressed (pointer or keyboard) long enough. */
@Component({
  selector: 'app-hold-button',
  template: `<button type="button"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoldButton {
  readonly duration = input(800, { transform: numberAttribute });

  // Events from the inner <button> bubble up to the host element.
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  // [1] Press and release, from pointer and keyboard events.
  private readonly press$ = merge(
    fromEvent(this.host, 'pointerdown'),
    fromEvent<KeyboardEvent>(this.host, 'keydown').pipe(filter(isActivationKey)),
  );
  private readonly release$ = merge(
    fromEvent(this.host, 'pointerup'),
    fromEvent(this.host, 'pointerleave'),
    fromEvent(this.host, 'keyup'),
  );

  // [2] outputFromObservable: an output that emits what the Observable emits. Angular subscribes
  // when the parent listens and unsubscribes when this component is destroyed.
  readonly held = outputFromObservable(
    this.press$.pipe(
      // Each press starts a timer; a release before it fires cancels it.
      switchMap(() => timer(this.duration()).pipe(takeUntil(this.release$))),
      map(() => this.duration()),
    ),
  );
}
