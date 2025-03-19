import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Redoubleeleve'
    },
    children: [
      {
        path: '',
        redirectTo: 'redoubleeleve',
        pathMatch: 'full'
      },
      {
        path: 'redoubleeleve',
        loadComponent: () => import('./redoubleeleve.component').then(m => m.RedoubleeleveComponent),
        data: {
          title: 'Redoubleeleve'
        }
      }
    ]
  }
];

