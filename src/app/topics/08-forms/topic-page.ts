import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { FormArrayDemo } from './demos/form-array-demo';
import { ReactiveProfileDemo } from './demos/reactive-profile-demo';
import { SignalFormDemo } from './demos/signal-form-demo';
import { TemplateDrivenDemo } from './demos/template-driven-demo';
import { ValidatorsDemo } from './demos/validators-demo';
import { EXERCISES } from './exercises';

/** Topic 08: template-driven, typed reactive and signal forms. */
@Component({
  selector: 'app-forms-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    TemplateDrivenDemo,
    ReactiveProfileDemo,
    FormArrayDemo,
    ValidatorsDemo,
    SignalFormDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPage {
  protected readonly exercises = EXERCISES;
}
