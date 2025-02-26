import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Avance'
    },
    children: [
      {
        path: 'avance',
        redirectTo: 'avance',
        pathMatch: 'full'
      },
      {
        path: 'avance',
        loadComponent: () => import('./avance.component').then(m => m.AvanceComponent),
        data: {
          title: 'Avance'
        }
      }
    ]
  }
];

