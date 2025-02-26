import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Eleves'
    },
    children: [
      {
        path: '',
        redirectTo: 'eleves',
        pathMatch: 'full'
      },
      {
        path: 'eleves',
        loadComponent: () => import('./eleves.component').then(m => m.ElevesComponent),
        data: {
          title: 'Eleves'
        }
      }
    ]
  }
];

