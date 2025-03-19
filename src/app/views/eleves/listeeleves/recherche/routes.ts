import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Recherche'
    },
    children: [
      {
        path: '',
        redirectTo: 'recherche',
        pathMatch: 'full'
      },
      {
        path: 'recherche',
        loadComponent: () => import('./recherche.component').then(m => m.RechercheComponent),
        data: {
          title: 'Recherche'
        }
      }
    ]
  }
];

