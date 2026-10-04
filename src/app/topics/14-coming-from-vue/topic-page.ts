import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { COMPARISONS } from './comparisons';
import { ContactsApp } from './crud/contacts-app';
import { CounterDemo } from './demos/counter-demo';
import { ParentChildDemo } from './demos/parent-child-demo';
import { ServicesDemo } from './demos/services-demo';
import { TemplateDemo } from './demos/template-demo';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';
import { VueCompare } from './ui/vue-compare';

/** The cards that share the contacts app, one step of the CRUD flow each. */
const CRUD_CARDS = ['form', 'request', 'response'] as const;

/**
 * Topic 14: Angular for Vue 3 developers. Four cards map the basics (components, templates,
 * parent / child, services), then three cards follow one CRUD flow: form, request, response.
 */
@Component({
  selector: 'app-coming-from-vue-page',
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    RouterLink,
    VueCompare,
    CounterDemo,
    TemplateDemo,
    ParentChildDemo,
    ServicesDemo,
    ContactsApp,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingFromVuePage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  protected readonly view = cardView(GUIDES, this.card);

  /**
   * The contacts app sits above the CRUD cards, outside them: moving between those three cards
   * keeps it (and what you typed) on the page.
   */
  protected readonly showCrud = computed(() => CRUD_CARDS.some((id) => this.view.shows(id)));

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;
  protected readonly comparisons = COMPARISONS;
}
