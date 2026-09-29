import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
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

/**
 * Topic 13: a feature written the pre-v17 way (in `legacy/`) and the modern version of each piece.
 * The page itself is modern; it is the root route of the lazy-loaded `LegacyModule`.
 */
@Component({
  selector: 'app-legacy-migration-page',
  // A standalone component can import an NgModule and use everything that module exports.
  imports: [DemoCard, TipsBox, CodePair, TasksModule, RouterLink, RouterOutlet],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyMigrationPage {
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
