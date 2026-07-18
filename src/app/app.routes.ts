import { Routes } from '@angular/router'
import { AuthGuard } from './auth/auth.guard'

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
    canLoad: [AuthGuard],
    loadComponent: () => import('./overview/overview.page').then((m) => m.OverviewPage),
  },
  // {
  //   path: 'overview',
  //   canLoad: [AuthGuard],
  //   children: [
  //     {
  //       path: 'view-experience',
  //       loadComponent: () =>
  //         import('./overview/view-experience/view-experience.page').then(
  //           (m) => m.ViewExperiencePage,
  //         ),
  //     },
  //   ],
  // },
  {
    path: 'view-experience',
    loadComponent: () =>
      import('./overview/view-experience/view-experience.page').then((m) => m.ViewExperiencePage),
    canLoad: [AuthGuard],
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./edit-profile/edit-profile.page').then((m) => m.EditProfilePage),
    canLoad: [AuthGuard],
  },
]
