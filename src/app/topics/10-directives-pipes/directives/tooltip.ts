import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
  ViewContainerRef,
} from '@angular/core';

/** Width limit of the bubble, also used to keep it inside the viewport. */
const BUBBLE_MAX_PX = 256;
const GAP_PX = 6;

let nextId = 0;

/** [1] The visual part of the tooltip: a directive has no template or styles, so it uses a component. */
@Component({
  selector: 'app-tooltip-bubble',
  template: '{{ text() }}',
  styles: `
    :host {
      position: fixed;
      z-index: 10;
      max-width: 16rem;
      padding: 0.3rem 0.6rem;
      font-size: 0.8rem;
      line-height: 1.4;
      color: var(--color-bg);
      background: var(--color-text);
      border-radius: var(--radius);
      pointer-events: none;
    }
  `,
  host: {
    role: 'tooltip',
    '[id]': 'bubbleId()',
    '[style.top.px]': 'top()',
    '[style.left.px]': 'left()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipBubble {
  readonly text = input.required<string>();
  readonly bubbleId = input.required<string>();
  readonly top = input(0);
  readonly left = input(0);
}

/**
 * Attribute directive: shows a text bubble on hover or keyboard focus, hides it on leave, blur
 * or Escape. `<button appTooltip="Saves the draft">`.
 */
@Directive({
  selector: '[appTooltip]',
  // [2] Listeners on the element the directive sits on.
  host: {
    '(mouseenter)': 'show()',
    '(focusin)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
    // Screen readers announce the bubble text as the host's description.
    '[attr.aria-describedby]': 'isOpen() ? id : null',
  },
})
export class Tooltip {
  readonly appTooltip = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  // The container at the host's position: created views go right after the host element.
  private readonly viewContainer = inject(ViewContainerRef);
  private bubble: ComponentRef<TooltipBubble> | null = null;

  protected readonly id = `app-tooltip-${nextId++}`;
  protected readonly isOpen = signal(false);

  protected show(): void {
    if (this.bubble) return;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const maxLeft = window.innerWidth - BUBBLE_MAX_PX - GAP_PX;

    // [3] A component created from code, placed right after the host element.
    this.bubble = this.viewContainer.createComponent(TooltipBubble);
    this.bubble.setInput('text', this.appTooltip());
    this.bubble.setInput('bubbleId', this.id);
    this.bubble.setInput('top', rect.bottom + GAP_PX);
    this.bubble.setInput('left', Math.max(GAP_PX, Math.min(rect.left, maxLeft)));
    this.isOpen.set(true);
  }

  protected hide(): void {
    // [4] No DestroyRef cleanup needed: views in the container are destroyed with the host.
    this.bubble?.destroy();
    this.bubble = null;
    this.isOpen.set(false);
  }
}
