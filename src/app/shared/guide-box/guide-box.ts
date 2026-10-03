import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RichText } from '../rich-text/rich-text';
import { Guide } from './guide';

/**
 * "Guided tour" at the top of a demo card's explanation: why, try it, the idea in code, and the
 * files to read, in that order.
 *
 * ```html
 * <app-guide-box [guide]="guides.inputs" />
 * ```
 */
@Component({
  selector: 'app-guide-box',
  imports: [RichText],
  templateUrl: './guide-box.html',
  styleUrl: './guide-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideBox {
  readonly guide = input.required<Guide>();
}
