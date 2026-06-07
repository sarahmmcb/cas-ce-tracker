import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { FooterComponent } from './core/footer/footer.component';

export const routes: Routes = [
{
  path: '',
  redirectTo: 'overview',
  pathMatch: 'full'
},
{
  path: 'auth',
  loadComponent: () => import('./auth/auth.page').then( m => m.AuthPage)
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
    loadComponent: () => import('./overview/view-experience/view-experience.page').then( m => m.ViewExperiencePage)
  }]
},
{
  path: 'footer',
  component: FooterComponent,
  outlet: 'footer'
},
{
  path: 'edit-profile',
  loadComponent: () => import('./edit-profile/edit-profile.page').then( m => m.EditProfilePage),
  canLoad: [AuthGuard]
}];
