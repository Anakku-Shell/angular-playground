import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  it('renders the sample demo card and updates the counter on click', async () => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('app-demo-card [demo-body] button');

    expect(button?.textContent).toContain('Clicked 0 times');

    button?.click();
    await fixture.whenStable();

    expect(button?.textContent).toContain('Clicked 1 times');
  });
});
