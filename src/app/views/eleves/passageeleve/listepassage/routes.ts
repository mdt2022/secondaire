import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Listepassage'
    },
    children: [
      {
        path: '',
        redirectTo: 'listepassage',
        pathMatch: 'full'
      },
      {
        path: 'listepassage',
        loadComponent: () => import('./listepassage.component').then(m => m.ListepassageComponent),
        data: {
          title: 'Listepassage'
        }
      }
    ]
  }
];

