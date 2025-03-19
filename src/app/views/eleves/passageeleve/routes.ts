import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Passageeleve'
    },
    children: [
      {
        path: '',
        redirectTo: 'passageeleve',
        pathMatch: 'full'
      },
      {
        path: 'passageeleve',
        loadComponent: () => import('./passageeleve.component').then(m => m.PassageeleveComponent),
        data: {
          title: 'Passageeleve'
        }
      }
    ]
  }
];

