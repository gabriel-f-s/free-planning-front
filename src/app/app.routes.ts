import { Routes } from '@angular/router';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';
import {Auth} from './features/auth/auth';
import {Navbar} from './core/layout/navbar/navbar';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },

    ]
  },
  {
    path: '',
    component: Navbar,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      { path: 'projects',
        loadChildren: () => import('./features/projects/project.routes').then(m => m.PROJECT_ROUTES)
      },
      { path: 'clients',
        loadChildren: ()=> import('./features/clients/client.routes').then(m => m.CLIENT_ROUTES)
      },
      { path: 'settings',
        loadComponent: () => import('./features/settings/settings').then(m => m.Settings)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  { path: '**', redirectTo: 'auth' },
];
