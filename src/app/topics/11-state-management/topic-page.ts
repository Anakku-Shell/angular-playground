import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { RxMethodDemo } from './demos/rx-method-demo';
import { ServiceStoreDemo } from './demos/service-store-demo';
import { SignalStateDemo } from './demos/signal-state-demo';
import { SignalStoreDemo } from './demos/signal-store-demo';
import { EXERCISES } from './exercises';

/** Topic 11: a signal-based store service and the same feature with NgRx SignalStore. */
@Component({
  selector: 'app-state-management-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    ServiceStoreDemo,
    SignalStoreDemo,
    RxMethodDemo,
    SignalStateDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementPage {
  protected readonly exercises = EXERCISES;
}
