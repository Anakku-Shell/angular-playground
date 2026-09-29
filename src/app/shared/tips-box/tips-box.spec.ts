import { TestBed } from '@angular/core/testing';

import { TipsBox } from './tips-box';

describe('TipsBox', () => {
  it('uses the default heading and tone', async () => {
    const fixture = TestBed.createComponent(TipsBox);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Tips & gotchas');
    expect(el.classList).not.toContain('is-warning');
  });

  it('switches to the warning tone', async () => {
    const fixture = TestBed.createComponent(TipsBox);
    fixture.componentRef.setInput('heading', 'Careful');
    fixture.componentRef.setInput('tone', 'warning');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Careful');
    expect(el.classList).toContain('is-warning');
  });
});
