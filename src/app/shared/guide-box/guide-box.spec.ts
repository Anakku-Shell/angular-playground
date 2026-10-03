import { TestBed } from '@angular/core/testing';

import { Guide } from './guide';
import { GuideBox } from './guide-box';

const GUIDE: Guide = {
  label: 'input()',
  question: 'pass data down',
  use: '`input()`',
  why: 'Parents configure children with `input()`.',
  steps: [
    { action: 'Move the slider.', result: 'The bar follows `uploaded()`.' },
    { action: 'Tick striped.', result: 'Stripes.' },
  ],
  snippet: 'readonly value = input(0);',
  read: [
    { file: 'demos/a.html', lookFor: 'The parent.' },
    { file: 'demos/a.ts', lookFor: 'The child, [1] to [3].' },
  ],
};

describe('GuideBox', () => {
  it('renders why, the steps, the snippet and the files in order', async () => {
    const fixture = TestBed.createComponent(GuideBox);
    fixture.componentRef.setInput('guide', GUIDE);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.guide__why code')?.textContent).toBe('input()');
    const steps = el.querySelectorAll('.guide__steps > li');
    expect(steps.length).toBe(2);
    expect(steps[0].querySelector('.guide__result code')?.textContent).toBe('uploaded()');
    expect(el.querySelector('pre')?.textContent).toBe('readonly value = input(0);');
    const files = [...el.querySelectorAll('.guide__files > li > code')].map((c) => c.textContent);
    expect(files).toEqual(['demos/a.html', 'demos/a.ts']);
  });
});
