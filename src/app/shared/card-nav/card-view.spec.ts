import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Guide } from '../guide-box/guide';
import { cardView, rememberedCard } from './card-view';

const base = { question: '', use: '', why: '', steps: [], snippet: '', read: [] };
const GUIDES: Record<string, Guide> = {
  inputs: { ...base, label: 'input()' },
  outputs: { ...base, label: 'output()' },
};

describe('cardView', () => {
  it('shows the map, one card or all of them depending on ?card', () => {
    const card = signal<string | undefined>(undefined);
    const view = cardView(GUIDES, card);
    expect(view.cards.map((link) => link.label)).toEqual(['input()', 'output()']);
    expect(view.showMap()).toBe(true);

    card.set('outputs');
    expect(view.showMap()).toBe(false);
    expect([view.shows('inputs'), view.shows('outputs')]).toEqual([false, true]);

    card.set('all');
    expect([view.shows('inputs'), view.shows('outputs')]).toEqual([true, true]);
  });
});

describe('rememberedCard', () => {
  afterEach(() => sessionStorage.clear());

  it('keeps the last ?card while the URL has none', () => {
    sessionStorage.setItem('card:test', 'outputs');
    const card = signal<string | undefined>(undefined);
    const current = TestBed.runInInjectionContext(() => rememberedCard('test', card));
    expect(current()).toBe('outputs');

    card.set('inputs');
    TestBed.tick();
    expect(current()).toBe('inputs');
    expect(sessionStorage.getItem('card:test')).toBe('inputs');

    // A navigation that drops ?card keeps the last card, not the one stored at creation.
    card.set(undefined);
    expect(current()).toBe('inputs');
  });
});
