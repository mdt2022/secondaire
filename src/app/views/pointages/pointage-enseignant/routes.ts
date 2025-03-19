import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pointage-enseignant'
    },
    children: [
      {
        path: '',
        redirectTo: 'pointage-enseignant',
        pathMatch: 'full'
      },
      {
        path: 'pointage-enseignant',
        loadComponent: () => import('./pointage-enseignant.component').then(m => m.PointageEnseignantComponent),
        data: {
          title: 'Pointage-enseignant'
        }
      }
    ]
  }
];

