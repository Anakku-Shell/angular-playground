import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DemoCard } from './demo-card';

// Content projection is tested through a host component that fills the slots.
@Component({
  imports: [DemoCard],
  template: `
    <app-demo-card>
      <h3 demo-title>Title</h3>
      <div demo-body>Demo</div>
      <p>Explanation</p>
    </app-demo-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHost {}

describe('DemoCard', () => {
  it('projects each piece of content into its slot', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.demo-card__title')?.textContent).toContain('Title');
    expect(el.querySelector('.demo-card__body')?.textContent).toContain('Demo');
    expect(el.querySelector('.demo-card__explanation')?.textContent).toContain('Explanation');
  });
});
