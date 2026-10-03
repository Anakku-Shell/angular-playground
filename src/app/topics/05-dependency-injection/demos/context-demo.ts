import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';

import { injectDocumentTitle } from './context/inject-document-title';

interface Outcome {
  readonly ok: boolean;
  readonly text: string;
}

/*
 * inject() only works in an injection context:
 *   field initializers and the constructor of a class Angular creates
 *   provider factories (useFactory, InjectionToken factory)
 *   functional guards, resolvers and interceptors
 *   inside runInInjectionContext(injector, fn)
 * Not in lifecycle hooks, event handlers, timers or promise callbacks (NG0203).
 */
@Component({
  selector: 'app-context-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="injectInHandler()">Call it in the click handler</button>
      <button type="button" (click)="useInjectedAtCreation()">Use the one from creation</button>
      <button type="button" (click)="runInContext()">Call it in runInInjectionContext</button>
    </div>

    <p class="outcome" [class.error]="outcome()?.ok === false">
      {{ outcome()?.text ?? 'Press a button.' }}
    </p>
  `,
  styles: `
    .outcome {
      margin: 0.75rem 0 0;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      overflow-wrap: anywhere;
    }
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextDemo {
  // [2] Field initializers run during construction: an injection context.
  private readonly documentTitle = injectDocumentTitle();
  // [3] Keep the injector to open an injection context later, on demand.
  private readonly injector = inject(Injector);

  protected readonly outcome = signal<Outcome | null>(null);

  protected injectInHandler(): void {
    try {
      // [1] A click handler runs long after construction: no injection context, so this throws.
      const title = injectDocumentTitle();
      this.outcome.set({ ok: true, text: title() });
    } catch (error) {
      this.outcome.set({ ok: false, text: error instanceof Error ? error.message : String(error) });
    }
  }

  protected useInjectedAtCreation(): void {
    this.outcome.set({ ok: true, text: `document.title = "${this.documentTitle()}"` });
  }

  protected runInContext(): void {
    const title = runInInjectionContext(this.injector, () => injectDocumentTitle());
    this.outcome.set({ ok: true, text: `document.title = "${title()}"` });
  }
}
