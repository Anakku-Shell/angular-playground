import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** A piece of text: plain, or inline code (it was between backticks). */
export interface TextPart {
  readonly text: string;
  readonly code: boolean;
}

/** Splits "Add `x` here" into plain and code parts. Odd segments were inside backticks. */
export function toParts(text: string): TextPart[] {
  return text.split('`').map((segment, index) => ({ text: segment, code: index % 2 === 1 }));
}

/**
 * Renders a string where text between backticks becomes inline `<code>`, so the data files
 * (guides, exercises) can stay plain strings.
 *
 * ```html
 * <app-rich-text text="Bind `[value]` to the signal" />
 * ```
 */
@Component({
  selector: 'app-rich-text',
  // Each part is wrapped in an element so the line breaks of this template add no stray spaces.
  template: `
    @for (part of parts(); track $index) {
      @if (part.code) {
        <code>{{ part.text }}</code>
      } @else {
        <span>{{ part.text }}</span>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichText {
  readonly text = input.required<string>();

  protected readonly parts = computed(() => toParts(this.text()));
}
