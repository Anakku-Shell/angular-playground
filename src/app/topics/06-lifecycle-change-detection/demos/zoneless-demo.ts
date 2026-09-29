import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

/** How long the buttons wait before changing state, outside any Angular event. */
export const ZONELESS_DELAY_MS = 500;

@Component({
  selector: 'app-zoneless-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="plainLater()">setTimeout → plain field</button>
      <button type="button" (click)="plainLaterMarked()">
        setTimeout → plain field + markForCheck()
      </button>
      <button type="button" (click)="signalLater()">setTimeout → signal</button>
      <button type="button" (click)="plainNow()">Plain field in the click handler</button>
    </div>

    <dl class="demo-values zoneless-values">
      <dt>Plain field</dt>
      <dd class="plain-value">{{ plain }}</dd>
      <dt>Signal</dt>
      <dd class="signal-value">{{ count() }}</dd>
    </dl>
  `,
  styles: `
    .zoneless-values {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.2rem 1rem;
      margin-bottom: 0;

      dd {
        margin: 0;
        font-family: var(--font-mono);
      }
    }
  `,
  styleUrl: './cd-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZonelessDemo {
  // A plain field: Angular has no way to know when it changes.
  protected plain = 0;
  protected readonly count = signal(0);

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach((id) => clearTimeout(id)));
  }

  protected plainLater(): void {
    // Nothing tells Angular: the view keeps the old value until something else refreshes it.
    this.later(() => this.plain++);
  }

  protected plainLaterMarked(): void {
    this.later(() => {
      this.plain++;
      // markForCheck() marks the view dirty and, without zone.js, also schedules the refresh.
      this.cdr.markForCheck();
    });
  }

  protected signalLater(): void {
    // A signal read by the template notifies Angular by itself.
    this.later(() => this.count.update((n) => n + 1));
  }

  protected plainNow(): void {
    // Events bound in the template mark the view dirty and schedule a refresh afterwards.
    this.plain++;
  }

  private later(change: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      change();
    }, ZONELESS_DELAY_MS);
    this.timers.add(id);
  }
}
