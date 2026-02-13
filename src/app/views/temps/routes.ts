import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Emplois du temps'
    },
    children: [
      {
        path: '',
        redirectTo: 'temps',
        pathMatch: 'full'
      },
      {
        path: 'temps',
        loadComponent: () => import('./temps.component').then(m => m.TempsComponent),
        data: {
          title: 'Emplois du temps'
        }
      },

      {
        path: 'new',
        loadComponent: () => import('./new/new.component').then(m => m.NewComponent),
        data: {
          title: 'Nouveau'
        }
      },
      {
        path: 'classe',
        loadComponent: () => import('./classe/classe.component').then(m => m.ClasseComponent),
        data: {
          title: 'Classe'
        }
      },
      {
        path: 'jour',
        loadComponent: () => import('./jour/jour.component').then(m => m.JourComponent),
        data: {
          title: 'Jour'
        }
      },
      {
        path: 'semaine',
        loadComponent: () => import('./semaine/semaine.component').then(m => m.SemaineComponent),
        data: {
          title: 'Semaine'
        }
      },
      {
        path: 'enseignant',
        loadComponent: () => import('./enseignant/enseignant.component').then(m => m.EnseignantComponent),
        data: {
          title: 'Enseignant'
        }
      }
    ]
  }
];
