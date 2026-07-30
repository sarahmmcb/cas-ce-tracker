import { Routes } from '@angular/router'
import { authGuard } from './auth/auth.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'overview',
    canActivate: [authGuard],
    loadComponent: () => import('./overview/overview.page').then((m) => m.OverviewPage),
  },
  {
    path: 'view-experience',
    loadComponent: () =>
      import('./overview/view-experience/view-experience.page').then((m) => m.ViewExperiencePage),
    canActivate: [authGuard],
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./edit-profile/edit-profile.page').then((m) => m.EditProfilePage),
    canActivate: [authGuard],
  },
]
