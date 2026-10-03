import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface User {
  readonly name: string;
  readonly role: 'admin' | 'editor' | 'viewer';
}

/** The class behind the @if demo: a score and an optional selected user. */
@Component({
  selector: 'app-if-demo',
  templateUrl: './if-demo.html',
  styleUrl: './if-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfDemo {
  protected readonly score = signal(72);

  protected readonly users: readonly User[] = [
    { name: 'Ada', role: 'admin' },
    { name: 'Linus', role: 'editor' },
    { name: 'Grace', role: 'viewer' },
  ];
  protected readonly selectedName = signal('');
  // `User | undefined`: the template narrows it with `@if (...; as user)`.
  protected readonly selectedUser = computed(() =>
    this.users.find((user) => user.name === this.selectedName()),
  );

  protected onScore(event: Event): void {
    this.score.set(Number((event.target as HTMLInputElement).value));
  }

  protected onSelect(event: Event): void {
    this.selectedName.set((event.target as HTMLSelectElement).value);
  }
}
