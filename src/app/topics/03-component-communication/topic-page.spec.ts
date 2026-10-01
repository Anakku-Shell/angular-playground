import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCommunicationPage } from './topic-page';

describe('ComponentCommunicationPage', () => {
  let fixture: ComponentFixture<ComponentCommunicationPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ComponentCommunicationPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function query<T extends Element = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  function click(scope: string, text: string): void {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${scope} button`)].find(
      (b) => b.textContent?.trim() === text,
    );
    if (!button) throw new Error(`button "${text}" not found in ${scope}`);
    button.click();
  }

  it('renders one demo card per concept', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(8);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('converts static attributes with the input transforms', () => {
    const steps = el.querySelectorAll('app-progress-bar')[1];

    expect(steps.textContent).toContain('Steps: 3 / 4 (75%)');
    expect(steps.querySelector('.fill')?.classList).toContain('striped');
  });

  it('resets the linkedSignal selection when the input changes', async () => {
    const selected = () => query('app-option-picker [aria-checked=true]').textContent?.trim();
    click('app-option-picker', 'L');
    await fixture.whenStable();
    expect(selected()).toBe('L');

    const select = query<HTMLSelectElement>('app-linked-demo select');
    select.value = 'shoes';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(selected()).toBe('38');
  });

  it('passes output payloads to the parent', async () => {
    query('app-star-rating [aria-label="4 of 5"]').click();
    await fixture.whenStable();

    expect(query('app-outputs-demo .rating').textContent).toBe('4');
    expect(query('app-outputs-demo .event-log').textContent).toContain('(rated) → 4');
  });

  it('writes back through [(value)] but not through a one-way binding', async () => {
    const quantity = () => query('app-model-demo .quantity').textContent;
    expect(quantity()).toBe('2');

    query('app-quantity-stepper.two-way [aria-label=Increase]').click();
    await fixture.whenStable();
    expect(quantity()).toBe('3');

    query('app-quantity-stepper.one-way [aria-label=Increase]').click();
    await fixture.whenStable();
    expect(quantity()).toBe('3');
    expect(query('app-quantity-stepper.one-way output').textContent).toBe('4');
  });

  it('projects content into slots, with fallback and ngProjectAs', () => {
    expect(query('app-panel.full .panel__footer').textContent).toContain('Save');
    expect(query('app-panel.no-footer .panel__footer').textContent).toContain('fallback content');
    expect(query('app-panel.no-footer .panel__header').textContent).toContain('No footer');
    expect(query('app-panel.project-as .panel__footer').querySelectorAll('button').length).toBe(2);
  });

  it('reaches elements and child components through queries', async () => {
    click('app-queries-demo', 'Focus the input');
    expect(document.activeElement).toBe(query('app-queries-demo input[type=search]'));

    click('app-queries-demo', 'Add lane');
    await fixture.whenStable();
    click('app-queries-demo', 'Start all');
    await fixture.whenStable();
    expect(query('app-queries-demo .running-count').textContent).toContain('Running: 3 of 3');

    click('app-queries-demo', 'Stop all');
    await fixture.whenStable();
    expect(query('app-queries-demo .running-count').textContent).toContain('Running: 0 of 3');
  });

  it('clears the projected input found with contentChild', async () => {
    const input = query<HTMLInputElement>('app-labeled-field input');
    input.value = 'someone@example.com';

    click('app-labeled-field', 'Clear');

    expect(input.value).toBe('');
    expect(query('app-labeled-field .required')).toBeTruthy();
  });

  it('forwards a grandchild event up to the parent', async () => {
    expect(query('app-tree-demo .remaining').textContent).toBe('3');

    query<HTMLInputElement>('app-task-item input').click();
    await fixture.whenStable();

    expect(query('app-tree-demo .remaining').textContent).toBe('4');
    expect(query('app-task-list h4').textContent).toContain('Work (0/3)');
  });

  it('shares the cart between siblings through the service', async () => {
    click('app-product-picker', 'Add');
    click('app-product-picker', 'Add');
    await fixture.whenStable();

    const summary = query('app-cart-summary');
    expect(summary.querySelector('h4')?.textContent).toContain('Cart (2)');
    expect(summary.textContent).toContain('2 × Keyboard');
    expect(summary.textContent).toContain('€98.00');
  });
});
