import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsTemplatesPage } from './topic-page';

describe('ComponentsTemplatesPage', () => {
  let fixture: ComponentFixture<ComponentsTemplatesPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ComponentsTemplatesPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(8);
  });

  it('adds an item on Enter in the events demo', async () => {
    const input = el.querySelector<HTMLInputElement>('app-events-demo input');
    if (!input) throw new Error('input not found');

    input.value = 'Write tests';
    input.dispatchEvent(new Event('input'));
    // Let the view render the draft first, as it would between two real keystrokes.
    // Otherwise `[value]` goes from '' to '' and Angular has nothing to update.
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    await fixture.whenStable();

    const items = [...el.querySelectorAll('app-events-demo li')].map((li) =>
      li.textContent?.trim(),
    );
    expect(items).toContain('Write tests');
    expect(input.value).toBe('');
  });

  it('keeps both ngModel inputs in sync', async () => {
    const [first, second] = el.querySelectorAll<HTMLInputElement>('app-two-way-demo input');

    first.value = 'Grace';
    first.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(second.value).toBe('Grace');
    expect(el.querySelector('app-two-way-demo')?.textContent).toContain('Hello, Grace!');
  });

  it('renders the ShadowDom sample inside a shadow root', () => {
    expect(el.querySelector('app-shadow-sample')?.shadowRoot).not.toBeNull();
  });
});
