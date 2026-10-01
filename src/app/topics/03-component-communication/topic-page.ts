import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { InputsDemo } from './demos/inputs-demo';
import { LinkedDemo } from './demos/linked-demo';
import { ModelDemo } from './demos/model-demo';
import { OutputsDemo } from './demos/outputs-demo';
import { ProjectionDemo } from './demos/projection-demo';
import { QueriesDemo } from './demos/queries-demo';
import { SiblingsDemo } from './demos/siblings-demo';
import { TreeDemo } from './demos/tree-demo';
import { EXERCISES } from './exercises';

/** Topic 03: how components pass data and events to each other. */
@Component({
  selector: 'app-component-communication-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    InputsDemo,
    LinkedDemo,
    OutputsDemo,
    ModelDemo,
    ProjectionDemo,
    QueriesDemo,
    TreeDemo,
    SiblingsDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCommunicationPage {
  protected readonly exercises = EXERCISES;
}
