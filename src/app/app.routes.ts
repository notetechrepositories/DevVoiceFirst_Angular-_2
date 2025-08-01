import { Routes } from '@angular/router';
import { UserLayout } from './Layout/user-layout/user-layout';
import { Landing } from './UserPanel/landing/landing';
import { AdminLayout } from './Layout/admin-layout/admin-layout';
import { BlankLayout } from './Layout/blank-layout/blank-layout';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: Landing },
    ],
  },
  {
    path: 'authentication',
    component: UserLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./AuthenticationPanel/authentication.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'user',
    component: UserLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./UserPanel/user.module').then((m) => m.UsersModule),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./CompanyPanel/company.module').then((m) => m.CompanyModule),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./AdminPanel/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
];
