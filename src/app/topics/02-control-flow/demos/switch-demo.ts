import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Plan = 'free' | 'pro' | 'team' | 'enterprise';

@Component({
  selector: 'app-switch-demo',
  templateUrl: './switch-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchDemo {
  protected readonly plans: readonly Plan[] = ['free', 'pro', 'team', 'enterprise'];
  protected readonly plan = signal<Plan>('free');

  protected readonly statusCodes = [200, 404, 500, 418];
  protected readonly status = signal(200);

  protected onStatus(event: Event): void {
    this.status.set(Number((event.target as HTMLSelectElement).value));
  }
}
