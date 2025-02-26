import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Matieres'
    },
    children: [
      {
        path: '',
        redirectTo: 'matieres',
        pathMatch: 'full'
      },
      {
        path: 'matieres',
        loadComponent: () => import('./matieres.component').then(m => m.MatieresComponent),
        data: {
          title: 'Matieres'
        }
      }
    ]
  }
];

