import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { ExerciseBox } from '../../shared/exercise-box/exercise-box';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { DropdownDemo } from './demos/dropdown-demo';
import { HighlightDemo } from './demos/highlight-demo';
import { HostDirectivesDemo } from './demos/host-directives-demo';
import { PureImpureDemo } from './demos/pure-impure-demo';
import { StructuralDemo } from './demos/structural-demo';
import { TooltipDemo } from './demos/tooltip-demo';
import { TruncateDemo } from './demos/truncate-demo';
import { EXERCISES } from './exercises';

/** Topic 10: custom attribute and structural directives, host directives and custom pipes. */
@Component({
  selector: 'app-directives-pipes-page',
  imports: [
    ExerciseBox,
    DemoCard,
    TipsBox,
    HighlightDemo,
    TooltipDemo,
    DropdownDemo,
    HostDirectivesDemo,
    StructuralDemo,
    TruncateDemo,
    PureImpureDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesPipesPage {
  protected readonly exercises = EXERCISES;
}
