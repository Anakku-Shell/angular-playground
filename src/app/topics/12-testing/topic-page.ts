import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { GreetingDemo } from './demos/greeting-demo';
import { QuoteDemo } from './demos/quote-demo';
import { RatingDemo } from './demos/rating-demo';
import { TemperatureDemo } from './demos/temperature-demo';
import { SNIPPETS } from './snippets';

/** Topic 12: unit tests with Vitest and TestBed. The specs in `subjects/` are the main content. */
@Component({
  selector: 'app-testing-page',
  imports: [DemoCard, TipsBox, RatingDemo, TemperatureDemo, QuoteDemo, GreetingDemo],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingPage {
  protected readonly snippets = SNIPPETS;
}
