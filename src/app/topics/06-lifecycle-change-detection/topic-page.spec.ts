import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZONELESS_DELAY_MS } from './demos/zoneless-demo';
import { LifecycleChangeDetectionPage } from './topic-page';

// Real timers: the zoneless demo waits in setTimeout on purpose.
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('LifecycleChangeDetectionPage', () => {
  let fixture: ComponentFixture<LifecycleChangeDetectionPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LifecycleChangeDetectionPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function text(selector: string): string {
    const found = el.querySelector(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  async function click(scope: string, label: string): Promise<void> {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!button) throw new Error(`button "${label}" not found in ${scope}`);
    button.click();
    await fixture.whenStable();
  }

  function hookLog(): string[] {
    return [...el.querySelectorAll('app-lifecycle-demo .hook-log li')].map(
      (li) => li.textContent?.trim() ?? '',
    );
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(4);
  });

  it('logs the lifecycle hooks in order', async () => {
    const hooks = (lines: string[]) => lines.map((line) => line.split(':')[0]);
    expect(hooks(hookLog())).toEqual([
      'constructor',
      'ngOnChanges',
      'ngOnInit',
      'ngAfterContentInit',
      'ngAfterViewInit',
    ]);

    await click('app-lifecycle-demo', 'Clear log');
    await click('app-lifecycle-demo', 'Change input');
    expect(hookLog()).toEqual(['ngOnChanges: label "Alpha" → "Beta"']);

    await click('app-lifecycle-demo', 'Destroy child');
    expect(el.querySelector('app-lifecycle-child')).toBeNull();
    expect(hookLog().slice(1)).toEqual(['ngOnDestroy', 'DestroyRef.onDestroy']);
  });

  it('runs afterNextRender once and afterEveryRender after each render', async () => {
    expect(text('app-render-hooks-demo .first-width')).toMatch(/^\d+ px$/);
    const before = Number(text('app-render-hooks-demo .render-count'));
    expect(before).toBeGreaterThan(0);

    await click('app-render-hooks-demo', 'Add message');
    expect(el.querySelectorAll('app-render-hooks-demo .message-list li').length).toBe(4);
    expect(Number(text('app-render-hooks-demo .render-count'))).toBeGreaterThan(before);
  });

  it('refreshes an OnPush child on a new reference or markForCheck, not on mutation', async () => {
    await click('app-on-push-demo', 'Mutate (same object)');
    expect(text('app-on-push-demo .parent-visits')).toBe('Ada, 1 visits');
    expect(text('app-on-push-demo .child-visits')).toBe('Ada, 0 visits');

    await click('app-on-push-demo', 'markForCheck() on the child');
    expect(text('app-on-push-demo .child-visits')).toBe('Ada, 1 visits');

    await click('app-on-push-demo', 'Replace (new object)');
    expect(text('app-on-push-demo .parent-visits')).toBe('Ada, 2 visits');
    expect(text('app-on-push-demo .child-visits')).toBe('Ada, 2 visits');
  });

  it('only refreshes a zoneless view when Angular is notified', async () => {
    const settle = async () => {
      await wait(ZONELESS_DELAY_MS + 50);
      await fixture.whenStable();
    };

    await click('app-zoneless-demo', 'setTimeout → plain field');
    await settle();
    expect(text('app-zoneless-demo .plain-value')).toBe('0');

    await click('app-zoneless-demo', 'setTimeout → plain field + markForCheck()');
    await settle();
    // Both increments show up: the first one was waiting for any refresh.
    expect(text('app-zoneless-demo .plain-value')).toBe('2');

    await click('app-zoneless-demo', 'setTimeout → signal');
    await settle();
    expect(text('app-zoneless-demo .signal-value')).toBe('1');

    await click('app-zoneless-demo', 'Plain field in the click handler');
    expect(text('app-zoneless-demo .plain-value')).toBe('3');
  });
});
