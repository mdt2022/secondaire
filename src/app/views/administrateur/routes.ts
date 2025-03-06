import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administrateur'
    },
    children: [
      {
        path: '',
        redirectTo: 'administrateur',
        pathMatch: 'full'
      },
      {
        path: 'administrateur',
        loadComponent: () => import('./administrateur.component').then(m => m.AdministrateurComponent),
        data: {
          title: 'Gestion des administrateurs'
        }
      }
    ]
  }
];

