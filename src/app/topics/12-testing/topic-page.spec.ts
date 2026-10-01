import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clock } from './subjects/greeting';
import { TestingPage } from './topic-page';

const API = 'https://dummyjson.com';

describe('TestingPage', () => {
  let fixture: ComponentFixture<TestingPage>;
  let el: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Clock, useValue: { now: () => new Date(2026, 0, 1, 9) } },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TestingPage);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`"${selector}" not found`);
    return found;
  }

  const text = (selector: string) => find(selector).textContent?.replace(/\s+/g, ' ').trim();

  async function type(selector: string, value: string): Promise<void> {
    const input = find<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('renders one card per testing technique', () => {
    expect(el.querySelectorAll('app-demo-card').length).toBe(6);
    for (const card of el.querySelectorAll('app-demo-card')) {
      expect(
        card.querySelectorAll('app-exercise-box .exercise__tasks > li').length,
      ).toBeGreaterThan(0);
    }
    // Code samples of the page itself, not the folded exercise solutions.
    const samples = [...el.querySelectorAll('pre')].filter(
      (pre) => !pre.closest('app-exercise-box'),
    );
    expect(samples.length).toBe(7);
  });

  it('keeps the rating and its parent signal in sync', async () => {
    const [editable, copy] = [...el.querySelectorAll('app-rating-demo app-star-rating')];
    editable.querySelectorAll<HTMLButtonElement>('.star')[3].click();
    await fixture.whenStable();

    expect(text('app-rating-demo .score')).toBe('4');
    expect(text('app-rating-demo .last-rated')).toBe('4');
    expect(copy.querySelectorAll('.star.on').length).toBe(4);

    find('app-rating-demo .reset').click();
    await fixture.whenStable();
    expect(text('app-rating-demo .score')).toBe('3');
    // Set by the parent: no rated event.
    expect(text('app-rating-demo .last-rated')).toBe('4');
  });

  it('converts temperatures both ways', async () => {
    await type('.celsius', '100');
    expect(find<HTMLInputElement>('.fahrenheit').value).toBe('212');
    expect(text('.feel')).toBe('Feels hot');

    await type('.fahrenheit', '41');
    expect(find<HTMLInputElement>('.celsius').value).toBe('5');
    expect(text('.feel')).toBe('Feels cold');
  });

  it('loads a quote and shows an error when the request fails', async () => {
    find('.next-quote').click();
    await fixture.whenStable();
    expect(text('app-quote-demo .loading')).toBe('Loading…');

    httpMock
      .expectOne(`${API}/quotes/random`)
      .flush({ id: 1, quote: 'Simplicity is prerequisite.', author: 'Dijkstra' });
    await fixture.whenStable();
    expect(text('.quote')).toContain('“Simplicity is prerequisite.”');
    expect(text('.next-quote')).toBe('Another quote');

    find('.next-quote').click();
    httpMock.expectOne(`${API}/quotes/random`).error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(text('app-quote-demo .error')).toBe('Could not load a quote.');
  });

  it('greets with the mocked clock and the typed name', async () => {
    expect(text('.greeting')).toBe('Good morning, Ada!');
    await type('.name', 'Grace');
    expect(text('.greeting')).toBe('Good morning, Grace!');
  });
});
