import { Directive, ElementRef, inject, output, signal } from '@angular/core';

export type CloseReason = 'outside click' | 'Escape' | 'item picked';

/**
 * Open/closed state for a menu. The template reaches it through `exportAs`:
 * `<div appDropdown #menu="appDropdown">` … `(click)="menu.toggle()"`.
 */
@Directive({
  selector: '[appDropdown]',
  // [1] The name for template references: #menu="appDropdown".
  exportAs: 'appDropdown',
  host: {
    '[class.is-open]': 'isOpen()',
    // [2] Global targets: `document:` and `window:` listen outside the host element.
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close("Escape")',
  },
})
export class Dropdown {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly openState = signal(false);
  readonly isOpen = this.openState.asReadonly();

  /** [3] Directives can have outputs too: `<div appDropdown (closed)="…">`. */
  readonly closed = output<CloseReason>();

  toggle(): void {
    this.openState.update((open) => !open);
  }

  close(reason: CloseReason): void {
    if (!this.openState()) return;
    this.openState.set(false);
    this.closed.emit(reason);
  }

  protected onDocumentClick(event: Event): void {
    // Clicks inside the menu (including its toggle button) are not "outside".
    if (event.target instanceof Node && this.host.nativeElement.contains(event.target)) return;
    this.close('outside click');
  }
}
