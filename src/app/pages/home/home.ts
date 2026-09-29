import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { TOPICS, topicUrl } from '../../topics/topics.registry';

/** Landing page: what the playground is, how a topic page is laid out, and the topic list. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, DemoCard, TipsBox],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly topics = TOPICS;
  protected readonly topicUrl = topicUrl;

  /** State for the sample demo card. */
  protected readonly clicks = signal(0);

  protected increment(): void {
    this.clicks.update((n) => n + 1);
  }
}
