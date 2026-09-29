import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Frame for one demo on a topic page. It has no inputs: the caller fills three
 * slots through content projection (`<ng-content select="...">`):
 *
 * ```html
 * <app-demo-card>
 *   <h3 demo-title>Title</h3>
 *   <div demo-body>...live demo...</div>
 *   <p>Explanation (default slot)</p>
 *   <app-tips-box>...</app-tips-box>
 * </app-demo-card>
 * ```
 */
@Component({
  selector: 'app-demo-card',
  templateUrl: './demo-card.html',
  styleUrl: './demo-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCard {}
