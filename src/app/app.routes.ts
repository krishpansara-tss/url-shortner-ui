import { Routes } from '@angular/router';
import { LoginPage } from './pages/auth/login-page/login-page';
import { RegisterPage } from './pages/auth/register-page/register-page';
import { AdminDasboardPage } from './pages/admin/admin-dasboard-page/admin-dasboard-page';
import { ManageUrlsPage } from './pages/admin/manage-urls-page/manage-urls-page';
import { ManageUsersPage } from './pages/admin/manage-users-page/manage-users-page';
import { ManagePaymentPage } from './pages/admin/manage-payment-page/manage-payment-page';
import { SystemConfigPage } from './pages/admin/system-config-page/system-config-page';
import { HomePage } from './pages/home-page/home-page';
import { DasboardPage } from './pages/users/dasboard-page/dasboard-page';
import { Urls } from './pages/urls/urls';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
  },

  {
    path: 'users',
    component: DasboardPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'urls',
        pathMatch: 'full',
      },
      {
        path: 'urls',
        component: Urls,
        canActivate: [authGuard],
      },
    ],
  },

  {
    path: 'admin',
    component: AdminDasboardPage,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'manage-users',
        pathMatch: 'full',
      },
      {
        path: 'manage-urls',
        component: ManageUrlsPage,
        canActivate: [adminGuard],
      },
      {
        path: 'manage-users',
        component: ManageUsersPage,
        canActivate: [adminGuard],
      },
      {
        path: 'manage-payments',
        component: ManagePaymentPage,
        canActivate: [adminGuard],
      },
      {
        path: 'manage-system-config',
        component: SystemConfigPage,
        canActivate: [adminGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
