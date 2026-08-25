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
    children: [
        
    ]
  },

  {
    path: 'admin',
    component: AdminDasboardPage,
    children: [
      {
        path: 'manage-urls',
        component: ManageUrlsPage,
      },
      {
        path: 'manage-users',
        component: ManageUsersPage,
      },
      {
        path: 'manage-payments',
        component: ManagePaymentPage,
      },
      {
        path: 'manage-system-config',
        component: SystemConfigPage,
      },
    ],
  },
];
