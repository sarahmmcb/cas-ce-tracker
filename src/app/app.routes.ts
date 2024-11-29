import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { OverviewPage } from './overview/overview.page';

export const routes: Routes = [
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
  canLoad: [AuthGuard],
  loadChildren: () => import('./overview/overview.routes').then(m => m.overviewRoutes)
},
{
  path: 'overview',
  canLoad: [AuthGuard],
  children: [{
    path: 'view-experience',
    loadChildren: () => import('./overview/view-experience/view-experience.routes').then( m => m.viewExperienceRoutes)
  }]
},
{
  path: 'edit-profile',
  loadComponent: () => import('./edit-profile/edit-profile.page').then( m => m.EditProfilePage),
  canLoad: [AuthGuard]
}];
