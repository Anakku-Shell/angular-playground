import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DRAFT_STORAGE_KEY, SAVE_DELAY_MS } from './demos/effect-demo';
import { SEARCH_DEBOUNCE_MS } from './demos/interop-demo';
import { SignalsPage } from './topic-page';

// Real timers: the demos use debounce and fake latency, so some tests wait a little.
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('SignalsPage', () => {
  let fixture: ComponentFixture<SignalsPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    fixture = TestBed.createComponent(SignalsPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function query<T extends Element = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return query(selector).textContent?.trim() ?? '';
  }

  async function click(scope: string, label: string): Promise<void> {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.trim() === label,
    );
    if (!button) throw new Error(`button "${label}" not found in ${scope}`);
    button.click();
    await fixture.whenStable();
  }

  async function type(selector: string, value: string): Promise<void> {
    const field = query<HTMLInputElement | HTMLTextAreaElement>(selector);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(8);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('runs computed() lazily and only after a dependency changed', async () => {
    // Two changes while hidden: the computation does not run for either.
    await click('app-basics-demo', '+1');
    await click('app-basics-demo', '+1');

    await click('app-basics-demo', 'Show total');
    expect(text('app-basics-demo .total')).toContain('37.50');
    expect(text('app-basics-demo .total')).toContain('run #1');

    await click('app-basics-demo', 'Hide total');
    await click('app-basics-demo', 'Show total');
    expect(text('app-basics-demo .total')).toContain('run #1');

    await click('app-basics-demo', '+1');
    expect(text('app-basics-demo .total')).toContain('run #2');
  });

  it('skips notifications for equal values with a custom equal function', async () => {
    await click('app-equality-demo', 'Set an equal copy');

    expect(text('app-equality-demo .by-reference')).toContain('run #2');
    expect(text('app-equality-demo .by-value')).toContain('run #1');

    await click('app-equality-demo', 'Move right');
    expect(text('app-equality-demo .by-value')).toContain('(1, 0)');
    expect(text('app-equality-demo .by-value')).toContain('run #2');
  });

  it('does not rerun a computed for a signal read with untracked()', async () => {
    await click('app-untracked-demo', 'b + 1');
    expect(text('app-untracked-demo .both')).toBe('12');
    expect(text('app-untracked-demo .only-a')).toBe('11');

    await click('app-untracked-demo', 'a + 1');
    expect(text('app-untracked-demo .only-a')).toBe('13');
  });

  it('debounces the effect with onCleanup and saves once', async () => {
    // The effect's first run may already have saved (beforeEach waits for the resource demo).
    const savesBefore = Number(text('app-effect-demo .saves'));

    await type('app-effect-demo textarea', 'H');
    await type('app-effect-demo textarea', 'Hi');
    await type('app-effect-demo textarea', 'Hi!');
    await wait(SAVE_DELAY_MS + 100);
    await fixture.whenStable();

    expect(Number(text('app-effect-demo .saves'))).toBe(savesBefore + 1);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBe('Hi!');
  });

  it('keeps the linkedSignal choice while the new source still offers it', async () => {
    const select = query<HTMLSelectElement>('app-linked-demo select');
    const changeCountry = async (country: string) => {
      select.value = country;
      select.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };

    await click('app-linked-demo', 'Express');
    await changeCountry('Portugal');
    expect(text('app-linked-demo .method')).toBe('Express');

    await changeCountry('Andorra');
    expect(text('app-linked-demo .method')).toBe('Standard');
  });

  // A loading resource counts as a pending task, so whenStable() waits for the loader.
  it('loads with resource(), cancels stale requests and reports errors', async () => {
    expect(text('app-resource-demo .status')).toBe('resolved');
    expect(text('app-resource-demo .result')).toContain('Ada Lovelace');

    const idButton = (id: number) =>
      [...el.querySelectorAll<HTMLButtonElement>('app-resource-demo button')].find(
        (b) => b.textContent?.trim() === String(id),
      );
    idButton(2)?.click();
    await wait(0); // let the resource start loading user 2
    await click('app-resource-demo', '4');

    expect(text('app-resource-demo .status')).toBe('error');
    expect(text('app-resource-demo .result')).toBe('User 4 not found');
    expect(text('app-resource-demo .cancelled')).toBe('1');
  });

  it('debounces a signal through toObservable() and toSignal()', async () => {
    await type('app-interop-demo input', 'Signal');
    expect(text('app-interop-demo .debounced')).toBe('""');

    await wait(SEARCH_DEBOUNCE_MS + 100);
    await fixture.whenStable();

    expect(text('app-interop-demo .debounced')).toBe('"signal"');
    expect(el.querySelectorAll('app-interop-demo .chips li').length).toBe(3);
  });

  it('emits an output built with outputFromObservable() only after a long press', async () => {
    const button = query('app-hold-button button');
    const pointer = (type: string) => button.dispatchEvent(new Event(type, { bubbles: true }));

    pointer('pointerdown');
    pointer('pointerup');
    await wait(900);
    await fixture.whenStable();
    expect(text('app-output-observable-demo .confirmations')).toBe('0');

    pointer('pointerdown');
    await wait(900);
    await fixture.whenStable();
    expect(text('app-output-observable-demo .confirmations')).toBe('1');
  });
});
