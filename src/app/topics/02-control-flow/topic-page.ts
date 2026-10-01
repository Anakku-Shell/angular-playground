import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { DeferDemo } from './demos/defer-demo';
import { ForDemo } from './demos/for-demo';
import { IfDemo } from './demos/if-demo';
import { LegacyDemo } from './demos/legacy-demo';
import { SwitchDemo } from './demos/switch-demo';
import { TrackDemo } from './demos/track-demo';
import { EXERCISES } from './exercises';

/** Topic 02: built-in control flow blocks and their legacy equivalents. */
@Component({
  selector: 'app-control-flow-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    IfDemo,
    ForDemo,
    TrackDemo,
    SwitchDemo,
    DeferDemo,
    LegacyDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlFlowPage {
  protected readonly exercises = EXERCISES;
}
