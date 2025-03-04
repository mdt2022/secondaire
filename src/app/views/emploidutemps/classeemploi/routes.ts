import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Classeemploi'
    },
    children: [
      {
        path: '',
        redirectTo: 'classeemploi',
        pathMatch: 'full'
      },
      {
        path: 'classeemploi',
        loadComponent: () => import('./classeemploi.component').then(m => m.ClasseemploiComponent),
        data: {
          title: 'Classeemploi'
        }
      }
    ]
  }
];

