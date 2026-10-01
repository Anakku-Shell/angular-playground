import {
  ComponentFixture,
  DeferBlockBehavior,
  DeferBlockState,
  TestBed,
} from '@angular/core/testing';

import { ControlFlowPage } from './topic-page';

describe('ControlFlowPage', () => {
  let fixture: ComponentFixture<ControlFlowPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    // Manual: @defer blocks stay on their placeholder until the test renders a state.
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual });
    fixture = TestBed.createComponent(ControlFlowPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  function click(selector: string, text: string): void {
    const button = [...el.querySelectorAll<HTMLButtonElement>(`${selector} button`)].find(
      (b) => b.textContent?.trim() === text,
    );
    if (!button) throw new Error(`button "${text}" not found`);
    button.click();
  }

  it('renders one demo card per concept, each ending with its exercises', () => {
    const cards = el.querySelectorAll('app-demo-card');
    expect(cards.length).toBe(6);
    for (const card of cards) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
  });

  it('shows the @empty block when the list is cleared', async () => {
    expect(el.querySelectorAll('app-for-demo li').length).toBe(3);

    click('app-for-demo', 'Clear');
    await fixture.whenStable();

    const items = el.querySelectorAll('app-for-demo li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('No tasks left');
  });

  it('keeps rows tracked by id and recreates rows tracked by identity', async () => {
    const [byId, , byIdentity] = el.querySelectorAll('app-track-demo section');
    const instances = (column: Element) =>
      [...column.querySelectorAll('.instance')].map((span) => span.textContent);
    const idBefore = instances(byId);
    const identityBefore = instances(byIdentity);

    click('app-track-demo', 'Reload (new objects)');
    await fixture.whenStable();

    expect(instances(byId)).toEqual(idBefore);
    expect(instances(byIdentity)).not.toEqual(identityBefore);
  });

  it('switches the plan description', async () => {
    const pro = el.querySelectorAll<HTMLInputElement>('app-switch-demo input[type=radio]')[1];
    pro.click();
    await fixture.whenStable();

    expect(el.querySelector('app-switch-demo')?.textContent).toContain('Pro: unlimited projects');
  });

  it('renders a @defer block once it completes', async () => {
    const [interaction] = await fixture.getDeferBlocks();
    expect(el.querySelector('app-heavy-widget')).toBeNull();

    await interaction.render(DeferBlockState.Complete);

    expect(el.querySelector('app-heavy-widget')?.textContent).toContain('on interaction');
  });
});
