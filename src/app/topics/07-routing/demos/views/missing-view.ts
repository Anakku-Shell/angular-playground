import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/** Route `**` inside the topic: any unknown path under /topics/07-routing lands here. */
@Component({
  selector: 'app-missing-view',
  imports: [RouterLink],
  template: `
    <h3>Nothing here</h3>
    <p>
      No child route matches <code class="missing-url">{{ url }}</code
      >. The topic's own <code>**</code> route caught it, so the app-wide 404 page never ran.
    </p>
    <a routerLink="../products">Go to the products</a>
  `,
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissingView {
  protected readonly url = inject(Router).url;
}
