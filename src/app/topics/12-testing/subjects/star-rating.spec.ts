import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRating } from './star-rating';

describe('StarRating', () => {
  let fixture: ComponentFixture<StarRating>;
  let el: HTMLElement;

  // [1] Render the component alone, with its default inputs.
  beforeEach(async () => {
    fixture = TestBed.createComponent(StarRating);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const stars = () => [...el.querySelectorAll<HTMLButtonElement>('.star')];
  const onCount = () => el.querySelectorAll('.star.on').length;

  it('renders one button per star, using the default inputs', () => {
    expect(stars().length).toBe(5);
    expect(el.querySelector('.rating-text')?.textContent).toBe('0 / 5');
  });

  it('reacts to inputs set through componentRef.setInput', async () => {
    // [2] setInput goes through Angular like a template binding would; assigning a field would not.
    fixture.componentRef.setInput('max', 3);
    fixture.componentRef.setInput('value', 2);
    await fixture.whenStable();

    expect(stars().length).toBe(3);
    expect(onCount()).toBe(2);
    expect(stars()[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('disables every star when readonly', async () => {
    fixture.componentRef.setInput('readonly', true);
    await fixture.whenStable();

    expect(stars().every((star) => star.disabled)).toBe(true);
  });

  it('emits rated on click; clicking the same star clears it', async () => {
    const rated: number[] = [];
    // [3] An OutputRef can be subscribed to directly, no EventEmitter needed.
    fixture.componentInstance.rated.subscribe((value) => rated.push(value));

    stars()[3].click();
    await fixture.whenStable();
    stars()[3].click();
    await fixture.whenStable();

    expect(rated).toEqual([4, 0]);
    expect(onCount()).toBe(0);
  });

  it('does not emit when the value is set from outside', async () => {
    const spy = vi.fn();
    fixture.componentInstance.rated.subscribe(spy);

    fixture.componentRef.setInput('value', 3);
    await fixture.whenStable();

    expect(spy).not.toHaveBeenCalled();
  });
});

/** [4] A host component: the only way to test `[(value)]` exactly as a parent uses it. */
@Component({
  imports: [StarRating],
  template: `<app-star-rating [(value)]="score" (rated)="lastRated = $event" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RatingHost {
  readonly score = signal(2);
  lastRated: number | null = null;
}

describe('StarRating inside a host (two-way binding)', () => {
  it('writes the model back to the parent signal, and reads it from there', async () => {
    const fixture = TestBed.createComponent(RatingHost);
    const el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    expect(el.querySelectorAll('.star.on').length).toBe(2);

    // Child → parent.
    el.querySelectorAll<HTMLButtonElement>('.star')[4].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.score()).toBe(5);
    expect(fixture.componentInstance.lastRated).toBe(5);

    // Parent → child.
    fixture.componentInstance.score.set(1);
    await fixture.whenStable();
    expect(el.querySelectorAll('.star.on').length).toBe(1);
  });
});
