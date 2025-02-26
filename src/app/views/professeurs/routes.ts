import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Professeurs'
    },
    children: [
      {
        path: '',
        redirectTo: 'professeurs',
        pathMatch: 'full'
      },
      {
        path: 'professeurs',
        loadComponent: () => import('./professeurs.component').then(m => m.ProfesseursComponent),
        data: {
          title: 'Professeurs'
        }
      }
    ]
  }
];

