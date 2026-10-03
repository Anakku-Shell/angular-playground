import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  concatMap,
  exhaustMap,
  mergeMap,
  Observable,
  OperatorFunction,
  Subject,
  switchMap,
} from 'rxjs';

/** How long each fake request takes. */
export const REQUEST_MS = 1000;

type OperatorName = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap';

// The four operators are generic and overloaded; wrapping each one fixes the types so the lanes
// can pick an operator by name.
type Flatten = (project: (n: number) => Observable<number>) => OperatorFunction<number, number>;
const OPERATORS: Record<OperatorName, Flatten> = {
  switchMap: (project) => switchMap(project),
  mergeMap: (project) => mergeMap(project),
  concatMap: (project) => concatMap(project),
  exhaustMap: (project) => exhaustMap(project),
};

interface Lane {
  readonly name: OperatorName;
  readonly rule: string;
  readonly clicks: Subject<number>;
  readonly events: WritableSignal<string[]>;
  count: number;
}

/** [1] A fake request: ▶ when it starts, ✓ when its answer is used, ✕ when it is cancelled. */
function fakeRequest(n: number, log: (event: string) => void): Observable<number> {
  return new Observable<number>((subscriber) => {
    log(`${n}▶`);
    let answered = false;
    const id = setTimeout(() => {
      answered = true;
      subscriber.next(n);
      subscriber.complete();
    }, REQUEST_MS);
    return () => {
      // The teardown also runs after complete; only an unanswered request counts as cancelled.
      if (!answered) log(`${n}✕`);
      clearTimeout(id);
    };
  });
}

/** Each click starts a 1 s "request"; the four flattening operators treat overlaps differently. */
@Component({
  selector: 'app-flattening-demo',
  template: `
    <p class="hint">Click one button several times within a second.</p>
    <div class="lanes">
      @for (lane of lanes; track lane.name) {
        <div class="lane" [attr.data-operator]="lane.name">
          <button type="button" (click)="fire(lane)">{{ lane.name }}</button>
          <span class="hint">{{ lane.rule }}</span>
          <code class="events">{{ lane.events().join(' ') || '–' }}</code>
        </div>
      }
    </div>
    <div class="demo-row">
      <button type="button" (click)="reset()">Clear</button>
      <span class="hint">▶ request starts · ✓ response used · ✕ request cancelled</span>
    </div>
  `,
  styleUrl: './http-demo.scss',
  styles: `
    .lanes {
      display: grid;
      gap: 0.75rem;
      margin: 0.75rem 0;
    }

    .lane {
      display: grid;
      grid-template-columns: 8rem minmax(0, 1fr);
      gap: 0.25rem 0.75rem;
      align-items: center;
    }

    .events {
      grid-column: 1 / -1;
      justify-self: start;
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatteningDemo {
  // [2] One lane per operator, each with its own stream of clicks.
  protected readonly lanes: Lane[] = [
    this.lane('switchMap', 'cancels the running one: latest wins (search)'),
    this.lane('mergeMap', 'runs all in parallel (independent requests)'),
    this.lane('concatMap', 'queues them, one at a time in order (ordered saves)'),
    this.lane('exhaustMap', 'ignores clicks while busy (submit button)'),
  ];

  protected fire(lane: Lane): void {
    lane.clicks.next(++lane.count);
  }

  protected reset(): void {
    for (const lane of this.lanes) {
      lane.count = 0;
      lane.events.set([]);
    }
  }

  private lane(name: OperatorName, rule: string): Lane {
    const events = signal<string[]>([]);
    const log = (event: string) => events.update((list) => [...list, event]);
    const clicks = new Subject<number>();
    const flatten = OPERATORS[name];

    // [3] Every lane runs the same pipe; only the operator changes.
    // Called from a field initializer (an injection context), so takeUntilDestroyed() needs no
    // DestroyRef argument.
    clicks
      .pipe(
        flatten((n) => fakeRequest(n, log)),
        takeUntilDestroyed(),
      )
      .subscribe((n) => log(`${n}✓`));

    return { name, rule, clicks, events, count: 0 };
  }
}
