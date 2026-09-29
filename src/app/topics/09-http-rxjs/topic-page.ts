import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCard } from '../../shared/demo-card/demo-card';
import { TipsBox } from '../../shared/tips-box/tips-box';
import { FlatteningDemo } from './demos/flattening-demo';
import { HttpResourceDemo } from './demos/http-resource-demo';
import { InterceptorsDemo } from './demos/interceptors-demo';
import { ObservableVsPromiseDemo } from './demos/observable-vs-promise-demo';
import { SearchDemo } from './demos/search-demo';
import { SharedRequestDemo } from './demos/shared-request-demo';

/** Topic 09: HttpClient, interceptors, RxJS essentials and httpResource. */
@Component({
  selector: 'app-http-rxjs-page',
  imports: [
    DemoCard,
    TipsBox,
    ObservableVsPromiseDemo,
    FlatteningDemo,
    InterceptorsDemo,
    SharedRequestDemo,
    SearchDemo,
    HttpResourceDemo,
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRxjsPage {}
