import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Frais'
    },
    children: [
      {
        path: '',
        redirectTo: 'frais',
        pathMatch: 'full'
      },
      {
        path: 'frais',
        loadComponent: () => import('./frais.component').then(m => m.FraisComponent),
        data: {
          title: 'Frais Scolaire'
        }
      }
    ]
  }
];
