import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Professeurcreate'
    },
    children: [
      {
        path: '',
        redirectTo: 'professeurcreate',
        pathMatch: 'full'
      },
      {
        path: 'professeurcreate',
        loadComponent: () => import('./professeurcreate.component').then(m => m.ProfesseurcreateComponent),
        data: {
          title: 'Professeurcreate'
        }
      }
    ]
  }
];

