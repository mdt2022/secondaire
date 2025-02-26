import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Emploidutemps'
    },
    children: [
      {
        path: '',
        redirectTo: 'emploidutemps',
        pathMatch: 'full'
      },
      {
        path: 'emploidutemps',
        loadComponent: () => import('./emploidutemps.component').then(m => m.EmploidutempsComponent),
        data: {
          title: 'Emploidutemps'
        }
      }
    ]
  }
];

