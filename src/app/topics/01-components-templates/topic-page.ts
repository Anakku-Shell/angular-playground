import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { BindingsDemo } from './demos/bindings-demo';
import { EncapsulationDemo } from './demos/encapsulation-demo';
import { EventsDemo } from './demos/events-demo';
import { InterpolationDemo } from './demos/interpolation-demo';
import { LetDemo } from './demos/let-demo';
import { PipesDemo } from './demos/pipes-demo';
import { TemplateRefsDemo } from './demos/template-refs-demo';
import { TwoWayDemo } from './demos/two-way-demo';
import { EXERCISES } from './exercises';

/** Topic 01: the template syntax every Angular component is built with. */
@Component({
  selector: 'app-components-templates-page',
  imports: [
    DemoCard,
    TipsBox,
    ExerciseBox,
    InterpolationDemo,
    BindingsDemo,
    EventsDemo,
    TwoWayDemo,
    TemplateRefsDemo,
    LetDemo,
    PipesDemo,
    EncapsulationDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsTemplatesPage {
  protected readonly exercises = EXERCISES;
}
