import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestionsdesclasses'
    },
    children: [
      {
        path: '',
        redirectTo: 'avance',
        pathMatch: 'full'
      },
      {
        path: 'gestionsdesclasses',
        loadComponent: () => import('./gestionsdesclasses.component').then(m => m.GestionsdesclassesComponent),
        data: {
          title: 'Gestionsdesclasses'
        }
      }
    ]
  }
];

