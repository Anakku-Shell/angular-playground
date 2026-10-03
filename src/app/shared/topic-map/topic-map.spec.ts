import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Guide } from '../guide-box/guide';
import { TopicMap } from './topic-map';

const base = { why: '', steps: [], snippet: '', read: [] };
const GUIDES: Record<string, Guide> = {
  inputs: { ...base, label: 'input()', question: 'pass data down', use: '`input()`' },
  outputs: { ...base, label: 'output()', question: 'report an event', use: '`output()`' },
};

@Component({
  imports: [TopicMap],
  template: `<app-topic-map [guides]="guides"><p class="intro">One rule.</p></app-topic-map>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHost {
  protected readonly guides = GUIDES;
}

describe('TopicMap', () => {
  it('projects the intro and lists one row per guide, linking to its card', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.map .intro')?.textContent).toBe('One rule.');
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[1].querySelector('code')?.textContent).toBe('output()');
    expect(rows[1].querySelector('a')?.getAttribute('href')).toBe('/?card=outputs');
  });
});
