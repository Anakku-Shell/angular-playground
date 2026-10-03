import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';

interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

const USERS: readonly User[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Mathematician' },
  { id: 2, name: 'Alan Turing', role: 'Computer scientist' },
  { id: 3, name: 'Grace Hopper', role: 'Rear admiral' },
];

const LATENCY_MS = 600;

/**
 * [1] Fake API call: resolves after a delay, rejects for unknown ids, and stops early (calling
 * `onCancel`) when the resource aborts it.
 */
function fetchUser(id: number, abortSignal: AbortSignal, onCancel: () => void): Promise<User> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      const user = USERS.find((u) => u.id === id);
      if (user) resolve(user);
      else reject(new Error(`User ${id} not found`));
    }, LATENCY_MS);

    abortSignal.addEventListener(
      'abort',
      () => {
        // [2] The resource also aborts finished requests when params change: count only real ones.
        if (settled) return;
        clearTimeout(timer);
        onCancel();
        reject(abortSignal.reason);
      },
      { once: true },
    );
  });
}

@Component({
  selector: 'app-resource-demo',
  templateUrl: './resource-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDemo {
  protected readonly ids = [1, 2, 3, 4];
  protected readonly userId = signal(1);
  protected readonly cancelled = signal(0);

  // [3] resource() is experimental in v21. `params` is reactive: when userId() changes, the loader
  // runs again and the previous request is aborted through `abortSignal`.
  protected readonly user = resource({
    params: () => this.userId(),
    loader: ({ params, abortSignal }) =>
      fetchUser(params, abortSignal, () => this.cancelled.update((n) => n + 1)),
  });
}
