import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { EmulatedSample } from './encapsulation/emulated-sample';
import { NoneSample } from './encapsulation/none-sample';
import { ShadowSample } from './encapsulation/shadow-sample';

@Component({
  selector: 'app-encapsulation-demo',
  imports: [EmulatedSample, NoneSample, ShadowSample],
  templateUrl: './encapsulation-demo.html',
  styleUrl: './encapsulation-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncapsulationDemo {
  protected readonly showNone = signal(false);
}
