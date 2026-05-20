import { Routes } from '@angular/router';
import { ClientList } from './client-list/client-list';
import { ClientDetail } from './client-detail/client-detail';

export const CLIENT_ROUTES: Routes = [
  { path: '', component: ClientList },
  { path: ':id', component: ClientDetail },
]
