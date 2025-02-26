import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Enseignercreate'
    },
    children: [
      {
        path: '',
        redirectTo: 'enseignercreate',
        pathMatch: 'full'
      },
      {
        path: 'enseignercreate',
        loadComponent: () => import('./enseignercreate.component').then(m => m.EnseignercreateComponent),
        data: {
          title: 'Enseignercreate'
        }
      }
    ]
  }
];

