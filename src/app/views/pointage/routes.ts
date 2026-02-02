// src/app/views/pointage/routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pointage',
    pathMatch: 'full'
  },
  {
    path: 'pointage',
    loadComponent: () => import('./pointage.component').then(m => m.PointageComponent),
    data: {
      title: 'Fiche de pointage'
    }
  },
  {
    path: 'liste-pointage',
    loadComponent: () => import('./liste-pointage/liste-pointage/liste-pointage.component').then(m => m.ListePointageComponent),
    data: {
      title: 'Liste des pointages'
    }
  },
  {
    path: 'fiche-validee',
    loadComponent: () => import('./fiche-validee/fiche-validee/fiche-validee.component').then(m => m.FicheValideeComponent),
    data: {
      title: 'Fiche validée'
    }
  },
  {
    path: 'honoraires',
    loadComponent: () => import('./honoraires/honoraires/honoraires.component').then(m => m.HonorairesComponent),
    data: {
      title: 'Honoraires'
    }
  },
  {
    path: '**',
    redirectTo: '/pointage'
  }
];
