import { TestBed } from '@angular/core/testing';

import { Clock, Greeting } from './greeting';

/** Creates the component with a fake clock stuck at `hour`. */
async function renderAt(hour: number, name = 'Ada'): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    // useValue: any object with the same shape. The real Clock is never created.
    providers: [{ provide: Clock, useValue: { now: () => new Date(2026, 0, 1, hour) } }],
  });
  const fixture = TestBed.createComponent(Greeting);
  fixture.componentRef.setInput('name', name);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Greeting', () => {
  it.each([
    [8, 'Good morning, Ada!'],
    [15, 'Good afternoon, Ada!'],
    [22, 'Good evening, Ada!'],
  ])('at %s:00 says "%s"', async (hour, expected) => {
    const el = await renderAt(hour);
    expect(el.textContent?.trim()).toBe(expected);
  });

  it('falls back to "stranger" without a name', async () => {
    const el = await renderAt(9, '');
    expect(el.textContent).toContain('stranger');
  });

  it('can spy on the real service instead of replacing it', async () => {
    // vi.spyOn keeps the real instance and only stubs one method; it also records the calls.
    const now = vi.spyOn(TestBed.inject(Clock), 'now').mockReturnValue(new Date(2026, 0, 1, 13));

    const fixture = TestBed.createComponent(Greeting);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Good afternoon');
    expect(now).toHaveBeenCalledTimes(1);
  });
});
