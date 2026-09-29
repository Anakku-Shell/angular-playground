/**
 * Short excerpts of the specs in `subjects/`, shown on the page. Kept as strings so the template
 * does not need to escape braces; the real, complete tests are the `.spec.ts` files.
 */
export const SNIPPETS = {
  component: `fixture = TestBed.createComponent(StarRating);
await fixture.whenStable();

fixture.componentRef.setInput('max', 3);
await fixture.whenStable();
expect(el.querySelectorAll('.star').length).toBe(3);

const rated: number[] = [];
fixture.componentInstance.rated.subscribe((v) => rated.push(v));
stars()[3].click();
await fixture.whenStable();
expect(rated).toEqual([4]);`,

  host: `@Component({
  imports: [StarRating],
  template: \`<app-star-rating [(value)]="score" />\`,
})
class RatingHost {
  readonly score = signal(2);
}
// click a star → host.score() changed; host.score.set(1) → one star on`,

  signals: `const store = TestBed.inject(TemperatureStore);
store.setCelsius(30);
expect(store.fahrenheit()).toBe(86); // computed: synchronous

TestBed.runInInjectionContext(() => effect(() => seen.push(store.celsius())));
TestBed.tick(); // effects run on tick, not on write`,

  http: `providers: [provideHttpClient(), provideHttpClientTesting()]

const result = firstValueFrom(api.page(2, 10));
const req = httpMock.expectOne((r) => r.url === \`\${API}/quotes\`);
expect(req.request.params.get('limit')).toBe('2');
req.flush({ quotes: [q1, q2], total: 100 });
expect(await result).toEqual([q1, q2]);

afterEach(() => httpMock.verify());`,

  mocking: `TestBed.configureTestingModule({
  providers: [{ provide: Clock, useValue: { now: () => new Date(2026, 0, 1, 8) } }],
});

// or keep the real service and stub one method:
vi.spyOn(TestBed.inject(Clock), 'now').mockReturnValue(new Date(2026, 0, 1, 13));`,

  router: `TestBed.configureTestingModule({
  providers: [provideRouter(userRoutes, withComponentInputBinding())],
});
const harness = await RouterTestingHarness.create();

const detail = await harness.navigateByUrl('/2', UserDetail);
expect(detail.id()).toBe('2');
expect(harness.routeNativeElement?.textContent).toContain('Grace Hopper');`,

  commands: `npm test                        # watch mode
npm test -- --include src/app/topics/12-testing
npm run test:coverage           # one run + report in coverage/`,
} as const;
