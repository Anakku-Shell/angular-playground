import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { BasicsDemo } from './demos/basics-demo';
import { EffectDemo } from './demos/effect-demo';
import { EqualityDemo } from './demos/equality-demo';
import { InteropDemo } from './demos/interop-demo';
import { LinkedDemo } from './demos/linked-demo';
import { OutputObservableDemo } from './demos/output-observable-demo';
import { ResourceDemo } from './demos/resource-demo';
import { UntrackedDemo } from './demos/untracked-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 04: signals, derived state, effects, async resources and RxJS interop. */
@Component({
  selector: 'app-signals-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    BasicsDemo,
    EqualityDemo,
    UntrackedDemo,
    EffectDemo,
    LinkedDemo,
    ResourceDemo,
    InteropDemo,
    OutputObservableDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
