import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';

/** Time between two values of the demo Observable. */
export const TICK_MS = 500;

/** A Promise is eager, single-valued and not cancellable; an Observable is none of those. */
@Component({
  selector: 'app-observable-vs-promise-demo',
  template: `
    <div class="demo-row">
      <button type="button" (click)="createPromise()">new Promise()</button>
      <button type="button" (click)="createObservable()">new Observable()</button>
      <button type="button" (click)="subscribe()">subscribe()</button>
      <button type="button" (click)="unsubscribe()">unsubscribe()</button>
      <button type="button" (click)="lines.set([])">Clear</button>
    </div>
    <ol class="log ovp-log" aria-live="polite">
      @for (line of lines(); track $index) {
        <li>{{ line }}</li>
      } @empty {
        <li class="muted">Press a button.</li>
      }
    </ol>
  `,
  styleUrl: './http-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableVsPromiseDemo {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly lines = signal<string[]>([]);

  private numbers$?: Observable<number>;
  private subscription?: Subscription;

  protected createPromise(): void {
    // The executor runs right now, whether anyone uses the result or not.
    const promise = new Promise<number>((resolve) => {
      this.log('Promise: executor runs immediately (eager)');
      setTimeout(() => resolve(1), TICK_MS);
    });
    // then() gets one value. There is no way to cancel it.
    void promise.then((value) => this.log(`Promise: resolved with ${value} (one value, done)`));
  }

  protected createObservable(): void {
    // Nothing runs yet: an Observable is a recipe that starts once per subscribe() (lazy).
    this.numbers$ = new Observable<number>((subscriber) => {
      this.log('Observable: producer starts (on subscribe)');
      let n = 0;
      const id = setInterval(() => {
        subscriber.next(++n);
        if (n === 3) subscriber.complete();
      }, TICK_MS);
      // The teardown runs on complete, error or unsubscribe. HttpClient aborts requests here.
      return () => {
        clearInterval(id);
        this.log('Observable: teardown (interval cleared)');
      };
    });
    this.log('Observable: created, nothing runs yet (lazy)');
  }

  protected subscribe(): void {
    if (!this.numbers$) {
      this.log('Create the Observable first.');
      return;
    }
    this.subscription?.unsubscribe();
    this.subscription = this.numbers$
      // Outside the constructor there is no injection context, so pass the DestroyRef. Leaving
      // the page unsubscribes even if the user never presses unsubscribe().
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => this.log(`Observable: next(${value})`),
        complete: () => this.log('Observable: complete'),
      });
  }

  protected unsubscribe(): void {
    if (!this.subscription || this.subscription.closed) {
      this.log('No active subscription.');
      return;
    }
    this.subscription.unsubscribe();
  }

  private log(line: string): void {
    this.lines.update((lines) => [...lines, line]);
  }
}
