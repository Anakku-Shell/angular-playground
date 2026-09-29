import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { BasicsDemo } from './demos/basics-demo';
import { EffectDemo } from './demos/effect-demo';
import { EqualityDemo } from './demos/equality-demo';
import { InteropDemo } from './demos/interop-demo';
import { LinkedDemo } from './demos/linked-demo';
import { OutputObservableDemo } from './demos/output-observable-demo';
import { ResourceDemo } from './demos/resource-demo';
import { UntrackedDemo } from './demos/untracked-demo';

/** Topic 04: signals, derived state, effects, async resources and RxJS interop. */
@Component({
  selector: 'app-signals-page',
  imports: [
    DemoCard,
    TipsBox,
    BasicsDemo,
    EqualityDemo,
    UntrackedDemo,
    EffectDemo,
    LinkedDemo,
    ResourceDemo,
    InteropDemo,
    OutputObservableDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsPage {}
