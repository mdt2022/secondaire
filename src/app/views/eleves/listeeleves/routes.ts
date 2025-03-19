import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Listeeleves'
    },
    children: [
      {
        path: '',
        redirectTo: 'listeeleves',
        pathMatch: 'full'
      },
      {
        path: 'listeeleves',
        loadComponent: () => import('./listeeleves.component').then(m => m.ListeelevesComponent),
        data: {
          title: 'Listeeleves'
        }
      }
    ]
  }
];

