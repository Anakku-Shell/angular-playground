import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { MiniApp } from './demos/mini-app';
import { ProgrammaticNavDemo } from './demos/programmatic-nav-demo';

/**
 * Topic 07: child routes, params as inputs, guards, resolvers, redirects and programmatic
 * navigation. This page is the component of the topic's '' route (see `07-routing.routes.ts`);
 * its children render in the mini app's <router-outlet>.
 */
@Component({
  selector: 'app-routing-page',
  imports: [DemoCard, TipsBox, RouterLink, MiniApp, ProgrammaticNavDemo],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingPage {}
