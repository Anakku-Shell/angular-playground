import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { BindingsDemo } from './demos/bindings-demo';
import { EncapsulationDemo } from './demos/encapsulation-demo';
import { EventsDemo } from './demos/events-demo';
import { InterpolationDemo } from './demos/interpolation-demo';
import { LetDemo } from './demos/let-demo';
import { PipesDemo } from './demos/pipes-demo';
import { TemplateRefsDemo } from './demos/template-refs-demo';
import { TwoWayDemo } from './demos/two-way-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 01: the template syntax every Angular component is built with. */
@Component({
  selector: 'app-components-templates-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    DemoCard,
    TipsBox,
    ExerciseBox,
    InterpolationDemo,
    BindingsDemo,
    EventsDemo,
    TwoWayDemo,
    TemplateRefsDemo,
    LetDemo,
    PipesDemo,
    EncapsulationDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsTemplatesPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
