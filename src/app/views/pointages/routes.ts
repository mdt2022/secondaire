import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pointages'
    },
    children: [
      {
        path: '',
        redirectTo: 'pointages',
        pathMatch: 'full'
      },
      {
        path: 'pointages',
        loadComponent: () => import('./pointages.component').then(m => m.PointagesComponent),
        data: {
          title: 'Pointages'
        }
      }
    ]
  }
];

