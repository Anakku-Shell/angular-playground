/**
 * Exercises are plain data (one `exercises.ts` per topic) rendered by `<app-exercise-box>`.
 * Keeping them in TypeScript strings avoids escaping `{{ }}`, `@` and `{` in templates.
 *
 * In `task` and `expect`, text between backticks renders as inline code.
 */
export interface ExerciseTask {
  /** What to change in the demo code. */
  readonly task: string;
  /** What you should see once it works. */
  readonly expect: string;
  /** One possible solution, shown folded. Plain code, rendered as-is. */
  readonly solution: string;
}

export interface Exercise {
  /** Files to open, relative to the topic folder. */
  readonly files: readonly string[];
  readonly tasks: readonly ExerciseTask[];
}
