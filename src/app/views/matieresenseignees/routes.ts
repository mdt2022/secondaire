import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Matieresenseignees'
    },
    children: [
      {
        path: '',
        redirectTo: 'matieresenseignees',
        pathMatch: 'full'
      },
      {
        path: 'matieresenseignees',
        loadComponent: () => import('./matieresenseignees.component').then(m => m.MatieresenseigneesComponent),
        data: {
          title: 'Matieresenseignees'
        }
      }
    ]
  }
];

