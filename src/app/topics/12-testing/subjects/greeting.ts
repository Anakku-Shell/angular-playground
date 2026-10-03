import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  input,
} from '@angular/core';

/**
 * [1] Wraps `new Date()`. Code that reads the time through a service can be tested at any hour: the
 * test provides a fake clock instead of changing the system time.
 */
@Injectable({ providedIn: 'root' })
export class Clock {
  now(): Date {
    return new Date();
  }
}

/** [2] Greets by the time of day, read from `Clock`. */
@Component({
  selector: 'app-greeting',
  template: `<p class="greeting">{{ greeting() }}, {{ name() || 'stranger' }}!</p>`,
  styles: `
    .greeting {
      margin: 0;
      font-size: 1.125rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting {
  private readonly clock = inject(Clock);

  readonly name = input('');

  // No signal is read here, so the hour is taken once, when the component is created.
  protected readonly greeting = computed(() => {
    const hour = this.clock.now().getHours();
    if (hour < 12) return 'Good morning';
    return hour < 20 ? 'Good afternoon' : 'Good evening';
  });
}
