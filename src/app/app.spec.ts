import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the header and the sidebar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.app-header__brand')?.textContent).toContain('Angular Playground');
    expect(el.querySelector('nav[aria-label="Topics"]')?.textContent).toContain('Home');
  });
});

describe('routes', () => {
  it('keeps the wildcard route last', () => {
    expect(routes.at(-1)?.path).toBe('**');
  });
});
