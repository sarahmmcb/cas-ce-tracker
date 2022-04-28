import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./overview/overview.module').then( m => m.OverviewPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'overview',
    canLoad: [AuthGuard],
    children: [{
      path: 'view-experience',
      loadChildren: () => import('./overview/view-experience/view-experience.module').then( m => m.ViewExperiencePageModule)
    }]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
    canLoad: [AuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
