import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Multi-slot projection: each <ng-content select="..."> takes the content that matches. */
@Component({
  selector: 'app-panel',
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Panel {}
