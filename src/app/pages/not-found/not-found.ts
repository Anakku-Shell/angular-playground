import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/** Rendered by the `**` wildcard route for any URL that matches nothing else. */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  /** The URL that did not match, read once when the page is created. */
  protected readonly requestedUrl = inject(Router).url;
}
