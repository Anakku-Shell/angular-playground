import {
  afterEveryRender,
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

/*
 * afterNextRender(fn)    once, after the next render: measure, focus, init a DOM library
 * afterEveryRender(fn)   after every render of the app: keep something in sync with the DOM
 * Both accept phases to batch DOM access: { earlyRead, write, mixedReadWrite, read }.
 * They only run in the browser (never during server-side rendering).
 */
@Component({
  selector: 'app-render-hooks-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="addMessage()">Add message</button>
      <button type="button" (click)="clicks.set(clicks() + 1)">
        Unrelated update ({{ clicks() }})
      </button>
    </div>

    <ul #messageList class="log message-list">
      @for (message of messages(); track $index) {
        <li>{{ message }}</li>
      }
    </ul>

    <dl class="demo-values render-values">
      <dt>Width measured by afterNextRender</dt>
      <dd class="first-width">{{ firstWidth() ?? '…' }} px</dd>
      <dt>Renders seen by afterEveryRender</dt>
      <!-- Not a binding: afterEveryRender writes this text straight into the DOM. -->
      <dd #renderCount class="render-count">0</dd>
    </dl>
  `,
  styles: `
    .message-list {
      max-height: 7.5rem;
      overflow-y: auto;
    }

    .render-values {
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
export class RenderHooksDemo {
  private readonly messageList = viewChild.required<ElementRef<HTMLElement>>('messageList');
  private readonly renderCount = viewChild.required<ElementRef<HTMLElement>>('renderCount');

  protected readonly messages = signal(['Message 1', 'Message 2', 'Message 3']);
  protected readonly clicks = signal(0);
  protected readonly firstWidth = signal<number | null>(null);

  private renders = 0;

  constructor() {
    // [1] Once, after the first render: the DOM exists, so it can be measured. In the constructor
    // the element is not created yet, and on the server these hooks never run.
    afterNextRender({
      read: () => {
        const width = this.messageList().nativeElement.getBoundingClientRect().width;
        // Setting a signal here schedules one more render. Fine once; see afterEveryRender below.
        this.firstWidth.set(Math.round(width));
      },
    });

    // [2] After every render of the whole app, not only of this component. Phases split DOM work:
    // `write` runs before `read`, so the browser lays out once per render.
    afterEveryRender({
      write: () => {
        // Keep the list scrolled to the bottom, like a chat.
        const list = this.messageList().nativeElement;
        list.scrollTop = list.scrollHeight;

        // [3] A plain field and a direct DOM write. Setting a signal here would schedule another
        // render, which runs this hook again: an endless loop.
        this.renders++;
        this.renderCount().nativeElement.textContent = String(this.renders);
      },
    });
  }

  protected addMessage(): void {
    this.messages.update((messages) => [...messages, `Message ${messages.length + 1}`]);
  }
}
