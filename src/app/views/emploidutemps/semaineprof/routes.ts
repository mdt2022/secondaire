import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Semaineprof'
    },
    children: [
      {
        path: '',
        redirectTo: 'semaineprof',
        pathMatch: 'full'
      },
      {
        path: 'semaineprof',
        loadComponent: () => import('./semaineprof.component').then(m => m.SemaineprofComponent),
        data: {
          title: 'Semaineprof'
        }
      }
    ]
  }
];

