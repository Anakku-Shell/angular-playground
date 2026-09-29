import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { HasUnsavedChanges } from '../guards';

/** Route `edit`, protected by `unsavedChangesGuard` (canDeactivate). */
@Component({
  selector: 'app-edit-view',
  template: `
    <h3>Edit profile</h3>
    <div class="demo-row">
      <label>
        Name
        <input #name class="name-input" [value]="draft()" (input)="draft.set(name.value)" />
      </label>
      <button type="button" [disabled]="!dirty()" (click)="save()">Save</button>
      <span class="status">{{ dirty() ? 'Unsaved changes' : 'Saved' }}</span>
    </div>

    @if (asking()) {
      <div class="notice demo-row leave-prompt" role="alertdialog" aria-label="Unsaved changes">
        Discard your changes?
        <button type="button" (click)="reply(true)">Leave</button>
        <button type="button" (click)="reply(false)">Stay</button>
      </div>
    }

    <p class="hint">Change the name, then click another link: the guard asks before leaving.</p>
  `,
  styles: `
    .leave-prompt {
      margin: 0.75rem 0 0;
    }
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditView implements HasUnsavedChanges {
  private readonly saved = signal('Ada');
  protected readonly draft = signal('Ada');
  protected readonly dirty = computed(() => this.draft() !== this.saved());
  protected readonly asking = signal(false);

  private answer?: (leave: boolean) => void;

  canLeave(): boolean | Promise<boolean> {
    if (!this.dirty()) {
      return true;
    }
    // A new navigation while the prompt is open: the previous one gets "stay".
    this.answer?.(false);
    this.asking.set(true);
    return new Promise((resolve) => (this.answer = resolve));
  }

  protected reply(leave: boolean): void {
    this.asking.set(false);
    this.answer?.(leave);
    this.answer = undefined;
  }

  protected save(): void {
    this.saved.set(this.draft());
  }
}
