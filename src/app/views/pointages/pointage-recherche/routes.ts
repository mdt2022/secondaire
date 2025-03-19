import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pointage-recherche'
    },
    children: [
      {
        path: '',
        redirectTo: 'pointage-recherche',
        pathMatch: 'full'
      },
      {
        path: 'pointage-recherche',
        loadComponent: () => import('./pointage-recherche.component').then(m => m.PointageRechercheComponent),
        data: {
          title: 'Pointage-recherche'
        }
      }
    ]
  }
];

