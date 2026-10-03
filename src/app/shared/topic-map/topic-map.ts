import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Guide } from '../guide-box/guide';
import { RichText } from '../rich-text/rich-text';

/**
 * "Before you start" section of a topic page: the topic's own intro (projected), a table that
 * maps each need to its tool and card (built from the topic's GUIDES), and how to study.
 *
 * ```html
 * <app-topic-map [guides]="guides">
 *   <p>The one rule of this topic...</p>
 * </app-topic-map>
 * ```
 */
@Component({
  selector: 'app-topic-map',
  imports: [RouterLink, RichText],
  templateUrl: './topic-map.html',
  styleUrl: './topic-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicMap {
  readonly guides = input.required<Readonly<Record<string, Guide>>>();

  protected readonly rows = computed(() =>
    Object.entries(this.guides()).map(([id, guide]) => ({ id, ...guide })),
  );
}
