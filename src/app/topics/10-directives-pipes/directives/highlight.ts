import { computed, Directive, input, signal } from '@angular/core';

/*
 * Three kinds of directives:
 *   components             a directive with a template (@Component)
 *   attribute directives   change the look or behaviour of their host (this one, tooltip...)
 *   structural directives  add or remove DOM by stamping an <ng-template> (has-role.ts)
 * The selector is a CSS selector: '[appHighlight]' (attribute, the usual), 'button[appX]',
 * '.some-class', 'app-x'. The 'app' prefix avoids clashes with HTML and libraries.
 * Host bindings: the 'host' object here; older code uses @HostBinding / @HostListener fields.
 */

/**
 * Attribute directive: paints the host's background while the pointer is over it.
 * `<p appHighlight>` uses the default color; `<p appHighlight="lightblue">` sets one.
 */
@Directive({
  // [1] An attribute selector: the directive attaches to any element with appHighlight.
  selector: '[appHighlight]',
  // [2] Host bindings and listeners in metadata (preferred over @HostBinding / @HostListener).
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
  // [3] An input named like the selector: the attribute both applies the directive and sets it.
  readonly appHighlight = input('');
  readonly defaultColor = input('#ffe58a');

  protected readonly hoveredState = signal(false);
  /** Read-only view of the hover state, for components that inject this directive. */
  readonly hovered = this.hoveredState.asReadonly();

  protected readonly color = computed(() => this.appHighlight() || this.defaultColor());
}
