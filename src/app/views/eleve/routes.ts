import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Eleve'
    },
    children: [
      {
        path: '',
        redirectTo: 'eleve',
        pathMatch: 'full'
      },
      {
        path: 'eleve',
        loadComponent: () => import('./eleve.component').then(m => m.EleveComponent),
        data: {
          title: 'Gestion'
        }
      },
      {
        path: 'new',
        loadComponent: () => import('./new/new.component').then(m => m.NewComponent),
        data: {
          title: 'Inscription'
        }
      },
      {
        path: 'liste',
        loadComponent: () => import('./liste/liste.component').then(m => m.ListeComponent),
        data: {
          title: 'Liste'
        }
      },
      {
        path: 'passage',
        loadComponent: () => import('./passage/passage.component').then(m => m.PassageComponent),
        data: {
          title: 'Passage'
        }
      },
      {
        path: 'validation',
        loadComponent: () => import('./validation/validation.component').then(m => m.ValidationComponent),
        data: {
          title: 'Validation'
        }
      },
      {
        path: 'exclusion',
        loadComponent: () => import('./exclusion/exclusion.component').then(m => m.ExclusionComponent),
        data: {
          title: 'Exclusion'
        }
      },
      {
        path: 'redoublement',
        loadComponent: () => import('./redoublement/redoublement.component').then(m => m.RedoublementComponent),
        data: {
          title: 'Redoublement'
        }
      },
      {
        path: 'statistique',
        loadComponent: () => import('./statistique/statistique.component').then(m => m.StatistiqueComponent),
        data: {
          title: 'Statistique'
        }
      },
      {
        path: 'admis',
        loadComponent: () => import('./admis/admis.component').then(m => m.AdmisComponent),
        data: {
          title: 'Admis'
        }
      }
    ]
  }
];


