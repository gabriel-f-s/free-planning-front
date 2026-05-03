import { Routes } from '@angular/router';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';
import {Auth} from './features/auth/auth';
import {Navbar} from './core/layout/navbar/navbar';
import {ProjectList} from './features/projects/project-list/project-list';
import {ProjectDetail} from './features/projects/project-detail/project-detail';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: Navbar,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'projects', component: ProjectList },
      { path: 'projects/:id', component: ProjectDetail },
      { path: '' , redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  { path: '**', redirectTo: 'auth' },
];
