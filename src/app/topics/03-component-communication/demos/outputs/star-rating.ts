import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * THE CHILD of the outputs demo. It shows a rating and reports clicks, but never stores the
 * rating itself: the parent does. Read this file first, then outputs-demo.html.
 */
@Component({
  selector: 'app-star-rating',
  template: `
    <!-- [3] Each click emits an output. The child does not touch value(): it waits for the
         parent to send the new rating back down. -->
    @for (star of stars; track star) {
      <button
        type="button"
        class="star"
        [class.filled]="star <= value()"
        [attr.aria-label]="star + ' of 5'"
        [attr.aria-pressed]="star === value()"
        (click)="rated.emit(star)"
      >
        ★
      </button>
    }
    <button type="button" (click)="cleared.emit()">Clear</button>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem;
    }

    .star {
      padding: 0.1rem 0.4rem;
      color: var(--color-text-muted);
      font-size: 1.25rem;
      line-height: 1;
    }

    .filled {
      color: var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  protected readonly stars = [1, 2, 3, 4, 5];

  // [1] The child only displays `value`; it never changes it. It reports the user's
  // choice and lets the parent decide ("data down, events up").
  readonly value = input(0);

  // [2] output<T>() declares a custom event with a payload of type T; `$event` in the parent.
  readonly rated = output<number>();
  // No payload: output() is output<void>().
  readonly cleared = output();
}
