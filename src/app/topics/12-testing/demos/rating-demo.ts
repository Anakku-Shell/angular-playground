import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { StarRating } from '../subjects/star-rating';

/** The rating bound two-way to a parent signal, plus a readonly copy of the same value. */
@Component({
  selector: 'app-rating-demo',
  imports: [StarRating],
  template: `
    <div class="demo-row">
      <app-star-rating [(value)]="score" (rated)="lastRated.set($event)" label="Your rating" />
      <button type="button" class="reset" (click)="score.set(3)">Parent sets 3</button>
    </div>
    <div class="demo-row">
      <app-star-rating [value]="score()" [max]="10" [readonly]="true" label="Readonly copy" />
    </div>
    <dl class="demo-values">
      <dt>Parent signal</dt>
      <dd class="score">{{ score() }}</dd>
      <dt>Last <code>rated</code> event</dt>
      <dd class="last-rated">{{ lastRated() ?? 'none yet' }}</dd>
    </dl>
  `,
  styles: `
    .demo-values {
      margin-top: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingDemo {
  protected readonly score = signal(2);
  protected readonly lastRated = signal<number | null>(null);
}
