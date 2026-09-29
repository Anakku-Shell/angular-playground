import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

/**
 * A 1..max star rating. `value` is a `model` (two-way bindable with `[(value)]`); `rated` fires
 * only when the user clicks, never when the parent sets the value. Clicking the current star
 * clears the rating.
 */
@Component({
  selector: 'app-star-rating',
  template: `
    <div class="stars" role="group" [attr.aria-label]="label()">
      @for (star of stars(); track star) {
        <button
          type="button"
          class="star"
          [class.on]="star <= value()"
          [disabled]="readonly()"
          [attr.aria-label]="star === 1 ? '1 star' : star + ' stars'"
          [attr.aria-pressed]="star <= value()"
          (click)="rate(star)"
        >
          ★
        </button>
      }
    </div>
    <span class="rating-text">{{ value() }} / {{ max() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      max-width: 100%;
    }

    .stars {
      display: flex;
      flex-wrap: wrap;
      gap: 0.15rem;
    }

    .star {
      padding: 0.1rem 0.4rem;
      color: var(--color-text-muted);
    }

    .star.on {
      color: var(--color-warning);
    }

    .rating-text {
      font-variant-numeric: tabular-nums;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  readonly value = model(0);
  readonly max = input(5);
  readonly readonly = input(false);
  readonly label = input('Rating');
  readonly rated = output<number>();

  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, index) => index + 1),
  );

  protected rate(star: number): void {
    const next = star === this.value() ? 0 : star;
    this.value.set(next);
    this.rated.emit(next);
  }
}
