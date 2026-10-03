import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { DeferDemo } from './demos/defer-demo';
import { ForDemo } from './demos/for-demo';
import { IfDemo } from './demos/if-demo';
import { LegacyDemo } from './demos/legacy-demo';
import { SwitchDemo } from './demos/switch-demo';
import { TrackDemo } from './demos/track-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 02: built-in control flow blocks and their legacy equivalents. */
@Component({
  selector: 'app-control-flow-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    IfDemo,
    ForDemo,
    TrackDemo,
    SwitchDemo,
    DeferDemo,
    LegacyDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlFlowPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
