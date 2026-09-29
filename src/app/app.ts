import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { APP_TITLE } from './app.routes';
import { TOPICS, topicUrl } from './topics/topics.registry';

/** Root component: header, sidebar with the topic list, and the routed page. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly appTitle = APP_TITLE;
  protected readonly angularVersion = VERSION.full;
  protected readonly topics = TOPICS;
  protected readonly topicUrl = topicUrl;
}
