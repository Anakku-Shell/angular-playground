import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

/**
 * LEGACY code in a zoneless app. With zone.js, any `setTimeout` or HTTP callback triggered change
 * detection, so writing a plain field was enough. Zoneless Angular (the default since v21) only
 * refreshes a view after a template event, a signal change, the `async` pipe or `markForCheck()`.
 */
@Component({
  selector: 'app-save-status',
  standalone: false,
  template: `
    <div class="demo-row">
      <button type="button" class="save-plain" (click)="savePlain()">Save (plain field)</button>
      <button type="button" class="save-marked" (click)="saveMarked()">
        Save (field + markForCheck)
      </button>
    </div>
    <p class="status" aria-live="polite">Status: {{ status }}</p>
  `,
  styles: `
    .status {
      margin: 0.75rem 0 0;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveStatusComponent implements OnDestroy {
  status = 'idle';
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private changeDetector: ChangeDetectorRef) {}

  /** [1] The click renders "saving…"; "saved" is written later but never rendered. */
  savePlain(): void {
    this.fakeSave(() => undefined);
  }

  /** [2] `markForCheck()` marks this view dirty and schedules a pass, so "saved" is rendered. */
  saveMarked(): void {
    this.fakeSave(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private fakeSave(afterWrite: () => void): void {
    clearTimeout(this.timer);
    this.status = 'saving…';
    this.timer = setTimeout(() => {
      this.status = 'saved';
      afterWrite();
    }, 800);
  }
}
