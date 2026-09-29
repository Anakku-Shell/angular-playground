import { computed, Directive, input, signal } from '@angular/core';

/**
 * Attribute directive: paints the host's background while the pointer is over it.
 * `<p appHighlight>` uses the default color; `<p appHighlight="lightblue">` sets one.
 */
@Directive({
  selector: '[appHighlight]',
  // Host bindings and listeners in metadata (preferred over @HostBinding / @HostListener).
  host: {
    '[class.is-highlighted]': 'hovered()',
    '[style.backgroundColor]': 'hovered() ? color() : null',
    // A fixed dark text color keeps the text readable on a light background in dark mode too.
    '[style.color]': 'hovered() ? "#1d2433" : null',
    '(mouseenter)': 'hoveredState.set(true)',
    '(mouseleave)': 'hoveredState.set(false)',
  },
})
export class Highlight {
  // An input named like the selector: the attribute both applies the directive and sets it.
  readonly appHighlight = input('');
  readonly defaultColor = input('#ffe58a');

  protected readonly hoveredState = signal(false);
  /** Read-only view of the hover state, for components that inject this directive. */
  readonly hovered = this.hoveredState.asReadonly();

  protected readonly color = computed(() => this.appHighlight() || this.defaultColor());
}
