import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Listeredouble'
    },
    children: [
      {
        path: '',
        redirectTo: 'listeredouble',
        pathMatch: 'full'
      },
      {
        path: 'listeredouble',
        loadComponent: () => import('./listeredouble.component').then(m => m.ListeredoubleComponent),
        data: {
          title: 'Listeredouble'
        }
      }
    ]
  }
];

