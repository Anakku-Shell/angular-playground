import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { InputsDemo } from './demos/inputs-demo';
import { LinkedDemo } from './demos/linked-demo';
import { ModelDemo } from './demos/model-demo';
import { OutputsDemo } from './demos/outputs-demo';
import { ProjectionDemo } from './demos/projection-demo';
import { QueriesDemo } from './demos/queries-demo';
import { SiblingsDemo } from './demos/siblings-demo';
import { TreeDemo } from './demos/tree-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 03: how components pass data and events to each other. */
@Component({
  selector: 'app-component-communication-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    CardPager,
    ExerciseBox,
    GuideBox,
    DemoCard,
    TipsBox,
    InputsDemo,
    LinkedDemo,
    OutputsDemo,
    ModelDemo,
    ProjectionDemo,
    QueriesDemo,
    TreeDemo,
    SiblingsDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCommunicationPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
