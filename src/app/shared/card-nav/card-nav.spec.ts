import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CardNav } from './card-nav';
import { CardLink } from './card-view';

const CARDS: readonly CardLink[] = [
  { id: 'inputs', label: 'input()' },
  { id: 'outputs', label: 'output()' },
];

describe('CardNav', () => {
  async function render(current?: string) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(CardNav);
    fixture.componentRef.setInput('cards', CARDS);
    fixture.componentRef.setInput('current', current);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('links the map, every card and "All" through ?card', async () => {
    const el = await render();
    const hrefs = [...el.querySelectorAll('.card-nav__tabs a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/?card=map', '/?card=inputs', '/?card=outputs', '/?card=all']);
    expect(el.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Map');
    expect(el.querySelector('.card-nav__jump')).toBeNull();
  });

  it('marks the current card and offers a jump to its exercises', async () => {
    const el = await render('outputs');
    expect(el.querySelector('[aria-current="page"]')?.textContent).toContain('output()');
    expect(el.querySelector('.card-nav__jump')?.getAttribute('href')).toBe(
      '/?card=outputs#exercises-outputs',
    );
  });
});
