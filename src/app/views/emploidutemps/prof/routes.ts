import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Prof'
    },
    children: [
      {
        path: '',
        redirectTo: 'prof',
        pathMatch: 'full'
      },
      {
        path: 'prof',
        loadComponent: () => import('./prof.component').then(m => m.ProfComponent),
        data: {
          title: 'Prof'
        }
      }
    ]
  }
];

