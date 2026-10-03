import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CardNav } from '../../shared/card-nav/card-nav';
import { CardPager } from '../../shared/card-nav/card-pager';
import { cardView, rememberedCard } from '../../shared/card-nav/card-view';
import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { GuideBox } from '../../shared/guide-box/guide-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TopicMap } from '../../shared/topic-map/topic-map';
import { CodePair } from './code-pair';
import { TasksModule } from './legacy/tasks.module';
import { VaultAccessService } from './legacy/vault-access.service';
import {
  GUARDS,
  INJECTION,
  INPUTS_OUTPUTS,
  MIGRATION_COMMANDS,
  MODULES,
  QUERIES_HOST,
  TEMPLATES,
  ZONELESS,
} from './snippets';
import { EXERCISES } from './exercises';
import { GUIDES } from './guides';

/**
 * Topic 13: a feature written the pre-v17 way (in `legacy/`) and the modern version of each piece.
 * The page itself is modern; it is the root route of the lazy-loaded `LegacyModule`.
 */
@Component({
  selector: 'app-legacy-migration-page',
  // A standalone component can import an NgModule and use everything that module exports.
  imports: [
    CardNav,
    CardPager,
    TopicMap,
    GuideBox,
    ExerciseBox,
    DemoCard,
    TipsBox,
    CodePair,
    TasksModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyMigrationPage {
  /**
   * The `?card=` query param, bound by `withComponentInputBinding()` (app.config.ts): a card id
   * shows that card alone, `all` shows every card, and `map` or no value shows the map.
   */
  readonly card = input<string>();
  // The vault links navigate and drop ?card. rememberedCard() keeps the last card seen (in
  // sessionStorage) while the URL has none, so the open card survives those navigations.
  protected readonly view = cardView(GUIDES, rememberedCard('13-legacy-migration', this.card));

  protected readonly guides = GUIDES;
  protected readonly exercises = EXERCISES;

  protected readonly access = inject(VaultAccessService);

  /** `?blocked=vault`, set by `UnlockGuard` when it redirects here. */
  readonly blocked = input<string>();

  protected readonly snippets = {
    modules: MODULES,
    inputsOutputs: INPUTS_OUTPUTS,
    injection: INJECTION,
    templates: TEMPLATES,
    queriesHost: QUERIES_HOST,
    guards: GUARDS,
    zoneless: ZONELESS,
  };
  protected readonly commands = MIGRATION_COMMANDS;

  protected toggleAccess(): void {
    this.access.unlocked = !this.access.unlocked;
  }
}
