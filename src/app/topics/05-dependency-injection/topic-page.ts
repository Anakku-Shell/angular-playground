import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { ContextDemo } from './demos/context-demo';
import { DestroyDemo } from './demos/destroy-demo';
import { ModifiersDemo } from './demos/modifiers-demo';
import { ProvidersDemo } from './demos/providers-demo';
import { RecipesDemo } from './demos/recipes-demo';
import { TokensDemo } from './demos/tokens-demo';
import { ViewProvidersDemo } from './demos/view-providers-demo';

/** Topic 05: providers, injectors, tokens, resolution modifiers and injection context. */
@Component({
  selector: 'app-dependency-injection-page',
  imports: [
    DemoCard,
    TipsBox,
    ProvidersDemo,
    ViewProvidersDemo,
    TokensDemo,
    RecipesDemo,
    ModifiersDemo,
    DestroyDemo,
    ContextDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyInjectionPage {}
