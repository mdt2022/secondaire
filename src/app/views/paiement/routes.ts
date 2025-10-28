import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paiement'
    },
    children: [
      {
        path: '',
        redirectTo: 'paiement',
        pathMatch: 'full'
      },
      {
        path: 'paiement',
        loadComponent: () => import('./paiement.component').then(m => m.PaiementComponent),
        data: {
          title: 'Gestion'
        }
      }
    ]
  }
];
