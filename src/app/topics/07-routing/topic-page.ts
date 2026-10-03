import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView, rememberedCard } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { MiniApp } from './demos/mini-app';
import { ProgrammaticNavDemo } from './demos/programmatic-nav-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/**
 * Topic 07: child routes, params as inputs, guards, resolvers, redirects and programmatic
 * navigation. This page is the component of the topic's '' route (see `07-routing.routes.ts`);
 * its children render in the mini app's <router-outlet>.
 */
@Component({
  selector: 'app-routing-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    RouterLink,
    MiniApp,
    ProgrammaticNavDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  // The mini app navigates, and its links drop ?card. rememberedCard() keeps the last card seen
  // (in sessionStorage) while the URL has none, so the open card survives those navigations.
  protected readonly view = cardView(GUIDES, rememberedCard('07-routing', this.card));

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
