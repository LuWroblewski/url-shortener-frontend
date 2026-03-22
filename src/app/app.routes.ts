import { Routes } from '@angular/router';
import { LoginLayout } from './core/layouts/login-layout/login-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayout,
  },
  {
    path: 'menu',
    component: MainLayout,
    children: [{ path: 'dashboard', component: Dashboard }],
  },
  { path: '**', redirectTo: '' },
];
