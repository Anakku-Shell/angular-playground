import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DependencyInjectionPage } from './topic-page';

describe('DependencyInjectionPage', () => {
  let fixture: ComponentFixture<DependencyInjectionPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(DependencyInjectionPage);
    // ?card=all: every card on the page, as the tests below need.
    fixture.componentRef.setInput('card', 'all');
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function query<T extends Element = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return query(selector).textContent?.trim() ?? '';
  }

  async function click(scope: string, label: string): Promise<void> {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.trim() === label,
    );
    if (!button) throw new Error(`button "${label}" not found in ${scope}`);
    button.click();
    await fixture.whenStable();
  }

  /** The panels matching `selector`, as { instance, count } read from their text. */
  function panels(selector: string): { instance: string; count: string }[] {
    return [...el.querySelectorAll(selector)].map((panel) => ({
      instance: panel.querySelector('.instance')?.textContent?.trim() ?? '',
      count: panel.querySelector('.count')?.textContent?.trim() ?? '',
    }));
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(7);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(card.querySelectorAll('app-guide-box .guide__steps > li').length).toBeGreaterThan(0);
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('shares the root instance and creates one per component with providers', async () => {
    const [a, b] = panels('app-providers-demo .root-group app-counter-panel');
    const [c, d] = panels('app-providers-demo .scoped-group app-counter-panel');
    expect(a.instance).toBe(b.instance);
    expect(c.instance).not.toBe(d.instance);
    expect(c.instance).not.toBe(a.instance);

    // +1 on panel A: B shows the same count, C and D are untouched.
    const panelA = query('app-providers-demo .root-group app-counter-panel');
    panelA.querySelector('button')?.click();
    await fixture.whenStable();

    const [a2, b2] = panels('app-providers-demo .root-group app-counter-panel');
    const [c2] = panels('app-providers-demo .scoped-group app-counter-panel');
    expect(a2.count).toBe('count 1');
    expect(b2.count).toBe('count 1');
    expect(c2.count).toBe('count 0');
  });

  it('hides viewProviders from projected content', () => {
    const root = panels('app-providers-demo .root-group app-counter-panel')[0].instance;
    const [providersView, providersProjected] = panels('app-providers-box app-counter-panel');
    const [viewProvidersView, viewProvidersProjected] = panels(
      'app-view-providers-box app-counter-panel',
    );

    expect(providersProjected.instance).toBe(providersView.instance);
    expect(viewProvidersProjected.instance).not.toBe(viewProvidersView.instance);
    expect(viewProvidersProjected.instance).toBe(root);
  });

  it('resolves tokens from their factory and from a component override', () => {
    // jsdom has no matchMedia: the factory falls back to "light".
    expect(text('app-tokens-demo .scheme')).toContain('light');
    expect(text('app-tokens-demo .default-price')).toBe('$9.99');
    expect(text('app-tokens-demo .euro-price')).toBe('€9.99');
  });

  it('shares an instance with useExisting and not with a second useClass', async () => {
    expect(text('app-recipes-demo .audit-identity')).toBe('true');
    expect(text('app-recipes-demo .debug-identity')).toBe('false');

    await click('app-recipes-demo', 'Greet');
    await click('app-recipes-demo', 'Write to AUDIT_LOG');
    await click('app-recipes-demo', 'Write to DEBUG_LOG');

    expect(text('app-recipes-demo .greeting')).toBe('Hello, Ada!');
    const loggerEntries = [...el.querySelectorAll('app-recipes-demo .logger-log li')].map((li) =>
      li.textContent?.trim(),
    );
    expect(loggerEntries).toEqual(['Greeter: greeted Ada', 'AUDIT_LOG: settings changed']);
    expect(text('app-recipes-demo .debug-log')).toBe('DEBUG_LOG: cache miss');
  });

  it('applies the resolution modifiers', () => {
    expect(text('app-modifiers-demo .outside-result')).toBe('null');

    const boxes = [...el.querySelectorAll('app-section-box .lookups')].map((l) =>
      l.textContent?.replace(/\s+/g, ' ').trim(),
    );
    expect(boxes).toEqual([
      'parent (skipSelf) → null',
      'parent (skipSelf) → Outer',
      'parent (skipSelf) → null',
    ]);

    const direct = '.direct-probe';
    expect(text(`${direct} .default`)).toBe('Inner');
    expect(text(`${direct} .self`)).toBe('null');
    expect(text(`${direct} .skip-self`)).toBe('Inner');
    expect(text(`${direct} .host`)).toBe('Inner');

    // Declared in FramedProbe's template: host stops at <app-framed-probe>.
    const framed = '.framed-probe';
    expect(text(`${framed} .default`)).toBe('Frame');
    expect(text(`${framed} .host`)).toBe('null');
  });

  it('runs DestroyRef callbacks when the component and its service are destroyed', async () => {
    expect(text('app-destroy-demo .activity-log')).toMatch(/Ticker #\d+: created/);

    await click('app-destroy-demo', 'Unmount ticker');

    expect(el.querySelector('app-ticker-panel')).toBeNull();
    const log = text('app-destroy-demo .activity-log');
    expect(log).toContain('interval cleared');
    expect(log).toContain('TickerPanel: DestroyRef.onDestroy');
  });

  it('throws NG0203 outside an injection context', async () => {
    await click('app-context-demo', 'Call it in the click handler');
    expect(text('app-context-demo .outcome')).toContain('NG0203');
    expect(query('app-context-demo .outcome').classList).toContain('error');

    await click('app-context-demo', 'Use the one from creation');
    expect(text('app-context-demo .outcome')).toContain('document.title');

    await click('app-context-demo', 'Call it in runInInjectionContext');
    expect(query('app-context-demo .outcome').classList).not.toContain('error');
  });
});
