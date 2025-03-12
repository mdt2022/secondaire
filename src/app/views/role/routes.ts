import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'roles'
    },
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      {
        path: 'roles',
        loadComponent: () => import('./role.component').then(m => m.RoleComponent),
        data: {

          title: 'Role'
        }
      }
    ]
  }
];

