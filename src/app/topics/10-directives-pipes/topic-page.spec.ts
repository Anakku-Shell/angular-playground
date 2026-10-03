import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TruncatePipe } from './pipes/truncate-pipe';
import { DirectivesPipesPage } from './topic-page';

describe('DirectivesPipesPage', () => {
  let fixture: ComponentFixture<DirectivesPipesPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(DirectivesPipesPage);
    // ?card=all: every card on the page, as the tests below need.
    fixture.componentRef.setInput('card', 'all');
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function text(selector: string): string {
    return find(selector).textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  async function dispatch(target: Element, type: string, init: EventInit = {}): Promise<void> {
    target.dispatchEvent(new Event(type, { bubbles: true, ...init }));
    await fixture.whenStable();
  }

  async function click(target: HTMLElement): Promise<void> {
    target.click();
    await fixture.whenStable();
  }

  function button(scope: string, label: string): HTMLButtonElement {
    const found = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.replace(/\s+/g, ' ').trim() === label,
    );
    if (!found) throw new Error(`button "${label}" not found in ${scope}`);
    return found;
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

  it('highlights on hover with the bound or the default color', async () => {
    const bound = find('app-highlight-demo .bound');
    expect(bound.style.backgroundColor).toBe('');

    await dispatch(bound, 'mouseenter');
    expect(bound.style.backgroundColor).toBe('lightblue');
    expect(bound.classList).toContain('is-highlighted');

    await click(find('app-highlight-demo input[value="pink"]'));
    expect(bound.style.backgroundColor).toBe('pink');

    await dispatch(bound, 'mouseleave');
    expect(bound.style.backgroundColor).toBe('');

    const custom = find('app-highlight-demo .custom-default');
    await dispatch(custom, 'mouseenter');
    expect(custom.style.backgroundColor).toBe('orange');
  });

  it('shows a tooltip on focus, links it with aria-describedby and hides it on Escape', async () => {
    const save = find('app-tooltip-demo .save');
    await dispatch(save, 'focusin');

    const bubble = find('app-tooltip-bubble');
    expect(bubble.textContent).toContain('Saves the draft');
    expect(bubble.getAttribute('role')).toBe('tooltip');
    expect(save.getAttribute('aria-describedby')).toBe(bubble.id);

    save.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(el.querySelector('app-tooltip-bubble')).toBeNull();
    expect(save.hasAttribute('aria-describedby')).toBe(false);
  });

  it('opens the dropdown through exportAs and closes it on an outside click or Escape', async () => {
    const toggle = find<HTMLButtonElement>('app-dropdown-demo .menu-toggle');
    await click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    await click(button('app-dropdown-demo .menu-list', 'Archive'));
    expect(text('.picked')).toBe('Archive');
    expect(text('.close-reason')).toBe('item picked');
    expect(el.querySelector('.menu-list')).toBeNull();

    await click(toggle);
    await click(find('app-dropdown-demo .hint'));
    expect(text('.close-reason')).toBe('outside click');

    await click(toggle);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(text('.close-reason')).toBe('Escape');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('composes highlight and tooltip on a component with hostDirectives', async () => {
    const tag = find('app-host-directives-demo app-tag');
    expect(tag.getAttribute('tabindex')).toBe('0');

    await dispatch(tag, 'mouseenter', { bubbles: false });
    expect(tag.style.backgroundColor).toBe('lightblue');
    expect(tag.textContent).toContain('●');
    expect(text('app-tooltip-bubble')).toBe('Signals are stable since v20.');
  });

  it('renders content by role with the structural directive and its else template', async () => {
    expect(el.querySelector('.everyone')).not.toBeNull();
    expect(el.querySelector('.editor-only')).toBeNull();
    expect(el.querySelector('.read-only')).not.toBeNull();
    expect(el.querySelector('.admin-only')).toBeNull();

    await click(find('app-structural-demo input[value="editor"]'));
    expect(el.querySelector('.editor-only')).not.toBeNull();
    expect(el.querySelector('.read-only')).toBeNull();
    expect(el.querySelector('.admin-only')).toBeNull();

    await click(find('app-structural-demo input[value="admin"]'));
    expect(el.querySelector('.editor-only')).not.toBeNull();
    expect(el.querySelector('.admin-only')).not.toBeNull();
  });

  it('truncates with default and custom arguments', async () => {
    expect(text('.default-args')).toBe('Pipes transform a va…');

    const range = find<HTMLInputElement>('.limit');
    range.value = '5';
    await dispatch(range, 'input');
    expect(text('.one-arg')).toBe('Pipes…');
    expect(text('.two-args')).toBe('Pipes [more]');
  });

  it('keeps the pure pipe stale after a mutation and updates both with a new array', async () => {
    const demo = 'app-pure-impure-demo';
    expect(text('.pure')).toBe('mango, orange');

    await click(button(demo, 'Add with push() (mutation)'));
    expect(text('.all')).toContain('banana');
    expect(text('.pure')).toBe('mango, orange');
    expect(text('.impure')).toBe('mango, orange, banana');

    await click(button(demo, 'Add as a new array'));
    expect(text('.pure')).toBe('mango, orange, banana, tangerine');
    expect(text('.impure')).toBe('mango, orange, banana, tangerine');
  });
});

describe('TruncatePipe', () => {
  // A pipe is a plain class: it can be tested without TestBed.
  const pipe = new TruncatePipe();

  it('leaves short texts alone and cuts long ones', () => {
    expect(pipe.transform('short', 10)).toBe('short');
    expect(pipe.transform('a longer text', 8)).toBe('a longer…');
    expect(pipe.transform('a longer text', 2, '!')).toBe('a!');
  });
});
