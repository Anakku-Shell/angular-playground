import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { StarRating } from './outputs/star-rating';

/** The parent of the outputs demo: owns the rating and reacts to the child's events. */
@Component({
  selector: 'app-outputs-demo',
  imports: [StarRating],
  templateUrl: './outputs-demo.html',
  styleUrl: './outputs-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputsDemo {
  protected readonly rating = signal(0);
  // Newest first, capped so the list stays short.
  protected readonly log = signal<readonly string[]>([]);

  // The handlers run when the child emits. The parent decides what the event means: here it
  // stores the rating, which then flows back down to the stars as [value].
  protected onRated(stars: number): void {
    this.rating.set(stars);
    this.addToLog(`(rated) → ${stars}`);
  }

  protected onCleared(): void {
    this.rating.set(0);
    this.addToLog('(cleared)');
  }

  private addToLog(entry: string): void {
    this.log.update((entries) => [entry, ...entries].slice(0, 4));
  }
}
