import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Enseignant'
    },
    children: [
      {
        path: '',
        redirectTo: 'enseignant',
        pathMatch: 'full'
      },
      {
        path: 'enseignant',
        loadComponent: () => import('./enseignant.component').then(m => m.EnseignantComponent),
        data: {
          title: 'Gestion'
        }
      }/*,
      {
        path: 'typography',
        loadComponent: () => import('./typography.component').then(m => m.TypographyComponent),
        data: {
          title: 'Typography'
        }
      }*/
    ]
  }
];

