import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Fraisecondaire'
    },
    children: [
      {
        path: '',
        redirectTo: 'fraisecondaire',
        pathMatch: 'full'
      },
      {
        path: 'fraisecondaire',
        loadComponent: () => import('./fraisecondaire.component').then(m => m.FraisecondaireComponent),
        data: {
          title: 'Fraisecondaire'
        }
      }
    ]
  }
];

