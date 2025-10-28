import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pointage.component').then(m => m.PointageComponent),
    data: {
      title: 'Gestion'
    }
  }
];
