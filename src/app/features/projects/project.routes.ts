import { Routes } from '@angular/router';
import { ProjectList } from './project-list/project-list';
import { ProjectDetail } from './project-detail/project-detail';

export const PROJECT_ROUTES: Routes = [
  { path: '', component: ProjectList },
  { path: ':id', component: ProjectDetail },
];
