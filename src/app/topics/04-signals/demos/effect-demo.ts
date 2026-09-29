import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

export const DRAFT_STORAGE_KEY = 'angular-playground.signals.draft';
export const SAVE_DELAY_MS = 500;

function readDraft(): string {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY) ?? '';
  } catch {
    // Storage can be blocked (private mode, sandboxed iframes): start empty.
    return '';
  }
}

@Component({
  selector: 'app-effect-demo',
  templateUrl: './effect-demo.html',
  styleUrls: ['./signals-demo.scss', './effect-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectDemo {
  protected readonly draft = signal(readDraft());
  protected readonly saves = signal(0);
  protected readonly savedAt = signal<string | null>(null);

  constructor() {
    // effect() needs an injection context (a constructor or a field initializer) and is
    // destroyed together with the component.
    effect((onCleanup) => {
      // The signals read here are the dependencies: only draft().
      const text = this.draft();
      const timer = setTimeout(() => this.save(text), SAVE_DELAY_MS);
      // Runs before the next run and on destroy: a new keystroke cancels the pending save.
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected clear(): void {
    this.draft.set('');
  }

  // Called by the timer, outside the effect body, so writing signals here is fine.
  private save(text: string): void {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
    } catch {
      // Storage unavailable: the demo still counts the save.
    }
    this.saves.update((n) => n + 1);
    this.savedAt.set(new Date().toLocaleTimeString());
  }
}
