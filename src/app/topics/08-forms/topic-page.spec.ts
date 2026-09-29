import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USERNAME_CHECK_MS } from './demos/validators';
import { FormsPage } from './topic-page';

// Real timers: the async validator waits USERNAME_CHECK_MS on purpose.
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('FormsPage', () => {
  let fixture: ComponentFixture<FormsPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FormsPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function query<T extends Element>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return query(selector).textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  /** Types into an input and leaves it, like a user would. */
  async function type(selector: string, value: string): Promise<void> {
    const input = query<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  async function click(scope: string, label: string): Promise<void> {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!button) throw new Error(`button "${label}" not found in ${scope}`);
    button.click();
    await fixture.whenStable();
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(5);
  });

  it('tracks template-driven values, state and errors', async () => {
    expect(text('.td-valid')).toBe('false');
    await type('.td-form input[name="name"]', 'Al');
    expect(text('.td-name-error')).toContain('At least 3 characters (2 so far)');
    expect(text('.td-name-state')).toBe('invalid · dirty · touched');

    await type('.td-form input[name="name"]', 'Ada');
    await type('.td-form input[name="email"]', 'ada@example.com');
    expect(text('.td-valid')).toBe('true');
    await click('app-template-driven-demo', 'Save');
    expect(text('.td-saved')).toBe('{"name":"Ada","email":"ada@example.com","newsletter":false}');
  });

  it('shows setValue vs patchValue, disabled controls and reset', async () => {
    const demo = 'app-reactive-profile-demo';
    await click(demo, 'setValue(name only)');
    expect(text('.profile-result')).toContain(
      "Must supply a value for form control with name: 'age'",
    );

    await click(demo, 'setValue(all fields)');
    await click(demo, 'patchValue(city)');
    expect(text('.profile-value')).toContain('"city": "Madrid"');
    expect(text('.profile-value')).toContain('"name": "Ada"');
    expect(text('.profile-status')).toBe('VALID');

    await click(demo, 'Disable age');
    expect(text('.profile-value')).not.toContain('"age"');
    expect(text('.profile-raw')).toContain('"age": 36');

    await click(demo, 'reset()');
    expect(text('.profile-raw')).toContain('"name": ""');
    expect(text('.profile-raw')).toContain('"age": 30');
    expect(text('.profile-log')).toBe('"Ada" → ""');
  });

  it('adds and removes FormArray items', async () => {
    const demo = 'app-form-array-demo';
    await click(demo, 'Add skill');
    expect(el.querySelectorAll(`${demo} .skill input`).length).toBe(3);
    expect(text('.array-valid')).toBe('false'); // the new item is empty

    for (let i = 0; i < 3; i++) await click(demo, 'Remove');
    expect(text('.skills-error')).toBe('Add at least one skill.');
    expect(text('.array-value')).toContain('"skills": []');
  });

  it('runs custom sync, async and cross-field validators', async () => {
    await type('.username', 'admin');
    expect(text('.username-status')).toBe('"admin" is reserved.');

    await type('.username', 'angular');
    expect(text('.username-status')).toBe('Checking availability…');
    expect(text('.signup-status')).toBe('PENDING');
    await wait(USERNAME_CHECK_MS + 50);
    await fixture.whenStable();
    expect(text('.username-status')).toBe('That username is taken.');

    await type('.password', 'secret-123');
    await type('.confirm', 'secret-124');
    expect(text('.mismatch-error')).toBe('Passwords do not match.');
    expect(query('.confirm').classList).toContain('ng-valid');
  });

  it('derives a signal form from its model', async () => {
    await type('.sf-email', 'not-an-email');
    expect(text('.sf-email-error')).toBe('Enter a valid email.');
    expect(text('.sf-model')).toContain('"email": "not-an-email"');

    await click('app-signal-form-demo', 'model.set(example)');
    expect(query<HTMLInputElement>('.sf-email').value).toBe('ada@example.com');
    expect(text('.sf-valid')).toBe('true');

    await click('app-signal-form-demo', 'Log in');
    expect(text('.sf-result')).toBe('Logged in as ada@example.com');
  });
});
