import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Matierecreation'
    },
    children: [
      {
        path: '',
        redirectTo: 'matierecreation',
        pathMatch: 'full'
      },
      {
        path: 'matierecreation/:id',
        loadComponent: () => import('./matierecreation.component').then(m => m.MatierecreationComponent),
        data: {
          title: 'Matierecreation'
        }
      }
    ]
  }
];

