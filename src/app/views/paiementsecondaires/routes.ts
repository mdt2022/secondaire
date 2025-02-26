import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paiementsecondaires'
    },
    children: [
      {
        path: '',
        redirectTo: 'paiementsecondaires',
        pathMatch: 'full'
      },
      {
        path: 'paiementsecondaires',
        loadComponent: () => import('./paiementsecondaires.component').then(m => m.PaiementsecondairesComponent),
        data: {
          title: 'Paiementsecondaires'
        }
      }
    ]
  }
];

