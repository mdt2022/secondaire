import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'EnregistrerFrai'
    },
    children: [
      {
        path: '',
        redirectTo: 'enregistrer-frai',
        pathMatch: 'full'
      },
      {
        path: 'enregistrer-frai',
        loadComponent: () => import('./enregistrer-frai.component').then(m => m.EnregistrerFraiComponent),
        data: {
          title: 'EnregistrerFrai'
        }
      }
    ]
  }
];

