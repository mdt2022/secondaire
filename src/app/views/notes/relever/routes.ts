import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Relever'
    },
    children: [
      {
        path: '',
        redirectTo: 'relever',
        pathMatch: 'full'
      },
      {
        path: 'relever',
        loadComponent: () => import('./relever.component').then(m => m.ReleverComponent),
        data: {
          title: 'Relever'
        }
      }
    ]
  }
];

