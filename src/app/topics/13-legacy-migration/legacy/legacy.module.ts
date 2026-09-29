import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegacyMigrationPage } from '../topic-page';
import { UnlockGuard } from './unlock.guard';
import { VaultComponent } from './vault.component';

const routes: Routes = [
  {
    path: '',
    // A module's routes can point to a standalone component: the page is the modern half of the topic.
    component: LegacyMigrationPage,
    children: [{ path: 'vault', component: VaultComponent, canActivate: [UnlockGuard] }],
  },
];

/**
 * LEGACY lazy-loaded routed module. The registry loads it with
 * `loadChildren: () => import('./legacy/legacy.module').then((m) => m.LegacyModule)`.
 * `RouterModule.forChild(routes)` registers the child routes and gives `VaultComponent`'s template
 * `routerLink`. `RouterModule.forRoot(routes)` was used once, in the root `AppModule`.
 */
@NgModule({
  declarations: [VaultComponent],
  imports: [RouterModule.forChild(routes)],
})
export class LegacyModule {}
