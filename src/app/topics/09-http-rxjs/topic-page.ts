import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { FlatteningDemo } from './demos/flattening-demo';
import { HttpResourceDemo } from './demos/http-resource-demo';
import { InterceptorsDemo } from './demos/interceptors-demo';
import { ObservableVsPromiseDemo } from './demos/observable-vs-promise-demo';
import { SearchDemo } from './demos/search-demo';
import { SharedRequestDemo } from './demos/shared-request-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/** Topic 09: HttpClient, interceptors, RxJS essentials and httpResource. */
@Component({
  selector: 'app-http-rxjs-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    ObservableVsPromiseDemo,
    FlatteningDemo,
    InterceptorsDemo,
    SharedRequestDemo,
    SearchDemo,
    HttpResourceDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRxjsPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
}
