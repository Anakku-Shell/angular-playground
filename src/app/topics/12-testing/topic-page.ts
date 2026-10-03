import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { GreetingDemo } from './demos/greeting-demo';
import { QuoteDemo } from './demos/quote-demo';
import { RatingDemo } from './demos/rating-demo';
import { TemperatureDemo } from './demos/temperature-demo';
import { SNIPPETS } from './snippets';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 12: unit tests with Vitest and TestBed. The specs in `subjects/` are the main content. */
@Component({
  selector: 'app-testing-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    RatingDemo,
    TemperatureDemo,
    QuoteDemo,
    GreetingDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;

  protected readonly snippets = SNIPPETS;
}
