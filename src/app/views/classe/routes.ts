import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Classe'
    },
    children: [
      {
        path: '',
        redirectTo: 'classe',
        pathMatch: 'full'
      },
      {
        path: 'classe',
        loadComponent: () => import('./classe.component').then(m => m.ClasseComponent),
        data: {
          title: 'Classe'
        }
      }
    ]
  }
];

