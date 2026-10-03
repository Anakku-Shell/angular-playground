import { TestBed } from '@angular/core/testing';

import { RichText, toParts } from './rich-text';

describe('RichText', () => {
  it('splits on backticks: odd segments are code', () => {
    expect(toParts('Bind `[value]` here')).toEqual([
      { text: 'Bind ', code: false },
      { text: '[value]', code: true },
      { text: ' here', code: false },
    ]);
  });

  it('renders the code parts as <code>', async () => {
    const fixture = TestBed.createComponent(RichText);
    fixture.componentRef.setInput('text', 'Call `set()` or `update()`');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect([...el.querySelectorAll('code')].map((c) => c.textContent)).toEqual([
      'set()',
      'update()',
    ]);
    expect(el.textContent).toBe('Call set() or update()');
  });
});
