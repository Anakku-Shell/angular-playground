import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RichText } from '../rich-text/rich-text';
import { Exercise } from './exercise';

/**
 * "Try it yourself" box at the end of a demo card: small changes to make in the demo's code,
 * what to expect, and a folded solution.
 *
 * ```html
 * <app-exercise-box [exercise]="exercises.bindings" />
 * ```
 */
@Component({
  selector: 'app-exercise-box',
  imports: [RichText],
  templateUrl: './exercise-box.html',
  styleUrl: './exercise-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseBox {
  readonly exercise = input.required<Exercise>();
}
