import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { LegacyModule } from './legacy/legacy.module';
import { LegacyMigrationPage } from './topic-page';

const BASE = '/topics/13-legacy-migration';

describe('LegacyMigrationPage', () => {
  let harness: RouterTestingHarness;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        // Same shape as the app: the topic URL lazy-loads the NgModule.
        provideRouter(
          [{ path: BASE.slice(1), loadChildren: () => LegacyModule }],
          withComponentInputBinding(),
        ),
      ],
    });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(BASE, LegacyMigrationPage);
    el = harness.routeNativeElement as HTMLElement;
  });

  afterEach(() => vi.useRealTimers());

  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  // Wait for a render after typing, as a real user does: ngModel only writes to the input when the
  // bound value differs from the last rendered one, and typing then submitting in the same tick
  // would look like '' → '' to it.
  async function type(value: string): Promise<void> {
    const input = find<HTMLInputElement>('.new-title');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
  }

  const titles = () =>
    Array.from(el.querySelectorAll('.task span'), (span) => span.textContent?.trim());

  async function clickFilter(name: string): Promise<void> {
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('.filter'));
    buttons.find((button) => button.textContent?.trim() === name)?.click();
    await harness.fixture.whenStable();
  }

  it('renders one card per legacy piece, each with its modern pair', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(9);
    expect(el.querySelectorAll('app-code-pair').length).toBe(7);
  });

  it('runs the legacy task board: add, toggle, filter, remove', async () => {
    expect(titles()).toHaveLength(3);

    await type('  Remove zone.js  ');
    find('form.add').dispatchEvent(new Event('submit'));
    await harness.fixture.whenStable();
    expect(titles().at(-1)).toBe('Remove zone.js');
    expect(find<HTMLInputElement>('.new-title').value).toBe('');

    await clickFilter('done');
    expect(titles()).toEqual(['Read the NgModule docs']);

    find<HTMLInputElement>('.task input[type="checkbox"]').click(); // un-done it
    await harness.fixture.whenStable();
    expect(find('.empty').textContent?.trim()).toBe('No task is done yet.');

    await clickFilter('all');
    find<HTMLButtonElement>('[aria-label="Remove Read the NgModule docs"]').click();
    await harness.fixture.whenStable();
    expect(titles()).not.toContain('Read the NgModule docs');
  });

  it('clears the new task title on Escape (@HostListener on document)', async () => {
    await type('Draft');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await harness.fixture.whenStable();
    expect(find<HTMLInputElement>('.new-title').value).toBe('');
  });

  it('keeps the vault behind the class-based guard until unlocked', async () => {
    await harness.navigateByUrl(`${BASE}/vault`);
    expect(el.querySelector('app-vault')).toBeNull();
    expect(find('.blocked').textContent).toContain('UnlockGuard');

    find<HTMLInputElement>('.unlock').click();
    await harness.fixture.whenStable();
    expect(el.querySelector('.blocked')).toBeNull();

    await harness.navigateByUrl(`${BASE}/vault`);
    expect(find('app-vault').textContent).toContain('returned true');
  });

  it('shows why zoneless code needs markForCheck after a timer', () => {
    vi.useFakeTimers();
    const fixture = harness.fixture;
    const status = () => find('.status').textContent?.trim();

    find('.save-plain').click();
    fixture.detectChanges();
    expect(status()).toBe('Status: saving…');
    vi.advanceTimersByTime(800);
    fixture.detectChanges();
    expect(status()).toBe('Status: saving…'); // the field is 'saved', the view is not

    find('.save-marked').click();
    vi.advanceTimersByTime(800);
    fixture.detectChanges();
    expect(status()).toBe('Status: saved');
  });
});
