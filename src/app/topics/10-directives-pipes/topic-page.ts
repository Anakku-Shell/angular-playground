import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { DropdownDemo } from './demos/dropdown-demo';
import { HighlightDemo } from './demos/highlight-demo';
import { HostDirectivesDemo } from './demos/host-directives-demo';
import { PureImpureDemo } from './demos/pure-impure-demo';
import { StructuralDemo } from './demos/structural-demo';
import { TooltipDemo } from './demos/tooltip-demo';
import { TruncateDemo } from './demos/truncate-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 10: custom attribute and structural directives, host directives and custom pipes. */
@Component({
  selector: 'app-directives-pipes-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    HighlightDemo,
    TooltipDemo,
    DropdownDemo,
    HostDirectivesDemo,
    StructuralDemo,
    TruncateDemo,
    PureImpureDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesPipesPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
