import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { FormArrayDemo } from './demos/form-array-demo';
import { ReactiveProfileDemo } from './demos/reactive-profile-demo';
import { SignalFormDemo } from './demos/signal-form-demo';
import { TemplateDrivenDemo } from './demos/template-driven-demo';
import { ValidatorsDemo } from './demos/validators-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 08: template-driven, typed reactive and signal forms. */
@Component({
  selector: 'app-forms-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    TemplateDrivenDemo,
    ReactiveProfileDemo,
    FormArrayDemo,
    ValidatorsDemo,
    SignalFormDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
