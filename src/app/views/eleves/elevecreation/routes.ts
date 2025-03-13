import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Elevecreation'
    },
    children: [
      {
        path: '',
        redirectTo: 'elevecreation',
        pathMatch: 'full'
      },
      {
        path: 'elevecreation',
        loadComponent: () => import('./elevecreation.component').then(m => m.ElevecreationComponent),
        data: {
          title: 'Elevecreation'
        }
      }
    ]
  }
];

