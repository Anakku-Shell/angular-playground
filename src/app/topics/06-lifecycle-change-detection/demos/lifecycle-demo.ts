import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { HookLog } from './lifecycle/hook-log';
import { LifecycleChild } from './lifecycle/lifecycle-child';

const LABELS = ['Alpha', 'Beta', 'Gamma'];

@Component({
  selector: 'app-lifecycle-demo',
  imports: [LifecycleChild],
  providers: [HookLog],
  template: `
    <div class="demo-row">
      <button type="button" [attr.aria-pressed]="mounted()" (click)="toggle()">
        {{ mounted() ? 'Destroy child' : 'Create child' }}
      </button>
      <button type="button" [disabled]="!mounted()" (click)="nextLabel()">Change input</button>
      <button type="button" (click)="log.clear()">Clear log</button>
    </div>

    @if (mounted()) {
      <app-lifecycle-child class="child" [label]="label()">projected text</app-lifecycle-child>
    }

    <ol class="log hook-log">
      @for (entry of log.entries(); track $index) {
        <li>{{ entry }}</li>
      } @empty {
        <li class="muted">empty</li>
      }
    </ol>
  `,
  styles: `
    .child {
      margin-top: 0.75rem;
    }

    .hook-log {
      list-style: decimal inside;
    }
  `,
  styleUrl: './cd-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleDemo {
  protected readonly log = inject(HookLog);
  protected readonly mounted = signal(true);
  protected readonly label = signal(LABELS[0]);

  protected toggle(): void {
    this.mounted.update((mounted) => !mounted);
  }

  protected nextLabel(): void {
    this.label.update((label) => LABELS[(LABELS.indexOf(label) + 1) % LABELS.length]);
  }
}
