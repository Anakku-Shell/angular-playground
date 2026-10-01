import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { LifecycleDemo } from './demos/lifecycle-demo';
import { OnPushDemo } from './demos/on-push-demo';
import { RenderHooksDemo } from './demos/render-hooks-demo';
import { ZonelessDemo } from './demos/zoneless-demo';
import { EXERCISES } from './exercises';

/** Topic 06: lifecycle hooks, render hooks, OnPush and zoneless change detection. */
@Component({
  selector: 'app-lifecycle-change-detection-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    LifecycleDemo,
    RenderHooksDemo,
    OnPushDemo,
    ZonelessDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleChangeDetectionPage {
  protected readonly exercises = EXERCISES;
}
