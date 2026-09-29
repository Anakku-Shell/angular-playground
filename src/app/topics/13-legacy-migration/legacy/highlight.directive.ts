import { Directive, HostBinding, HostListener, Input } from '@angular/core';

/** LEGACY attribute directive: `@HostBinding` and `@HostListener` instead of `host: {}`. */
@Directive({
  selector: '[appHighlight]',
  standalone: false,
})
export class HighlightDirective {
  // The input has the selector's name, so `appHighlight="…"` sets it. Empty = the default color.
  @Input() appHighlight = '';

  @HostBinding('style.backgroundColor') background = '';

  @HostListener('mouseenter')
  onEnter(): void {
    this.background = this.appHighlight || 'var(--color-hover)';
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.background = '';
  }
}
