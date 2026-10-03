import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { ContextDemo } from './demos/context-demo';
import { DestroyDemo } from './demos/destroy-demo';
import { ModifiersDemo } from './demos/modifiers-demo';
import { ProvidersDemo } from './demos/providers-demo';
import { RecipesDemo } from './demos/recipes-demo';
import { TokensDemo } from './demos/tokens-demo';
import { ViewProvidersDemo } from './demos/view-providers-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 05: providers, injectors, tokens, resolution modifiers and injection context. */
@Component({
  selector: 'app-dependency-injection-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    ProvidersDemo,
    ViewProvidersDemo,
    TokensDemo,
    RecipesDemo,
    ModifiersDemo,
    DestroyDemo,
    ContextDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyInjectionPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
