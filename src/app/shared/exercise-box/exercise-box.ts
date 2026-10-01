import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Exercise } from './exercise';

/** A piece of text: plain, or inline code (it was between backticks). */
interface TextPart {
  readonly text: string;
  readonly code: boolean;
}

/** Splits "Add `x` here" into plain and code parts. Odd segments were inside backticks. */
function toParts(text: string): TextPart[] {
  return text.split('`').map((segment, index) => ({ text: segment, code: index % 2 === 1 }));
}

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
  templateUrl: './exercise-box.html',
  styleUrl: './exercise-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseBox {
  readonly exercise = input.required<Exercise>();

  // Parse the backticks once per input change, not on every render.
  protected readonly tasks = computed(() =>
    this.exercise().tasks.map((task) => ({
      task: toParts(task.task),
      expect: toParts(task.expect),
      solution: task.solution,
    })),
  );
}
