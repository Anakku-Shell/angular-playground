import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
} from '@angular/core';

/**
 * Wraps an <input> that the parent projects. The parent marks it with `#control`, and
 * contentChild() finds it among the projected content (viewChild() would not: it only sees
 * this component's own template).
 */
@Component({
  selector: 'app-labeled-field',
  template: `
    <!-- The control is projected into the label, so the linter cannot see it. -->
    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
    <label class="label">
      {{ label() }}
      @if (required()) {
        <span class="required" aria-hidden="true">*</span>
      }
      <ng-content />
    </label>
    <button type="button" (click)="clear()">Clear</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .label {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .required {
      color: var(--color-accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabeledField {
  readonly label = input.required<string>();

  // `.required`: an error is thrown if the parent projects nothing marked #control.
  private readonly control = contentChild.required<ElementRef<HTMLInputElement>>('control');

  // Reads a DOM property once. It is not reactive to later attribute changes: a query gives
  // access to an element, not a signal of its state.
  protected readonly required = computed(() => this.control().nativeElement.required);

  protected clear(): void {
    const input = this.control().nativeElement;
    input.value = '';
    input.focus();
  }
}
