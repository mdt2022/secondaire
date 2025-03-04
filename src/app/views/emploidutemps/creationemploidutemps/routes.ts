import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Creationemploidutemps'
    },
    children: [
      {
        path: '',
        redirectTo: 'creationemploidutemps',
        pathMatch: 'full'
      },
      {
        path: 'creationemploidutemps',
        loadComponent: () => import('./creationemploidutemps.component').then(m => m.CreationemploidutempsComponent),
        data: {
          title: 'Creationemploidutemps'
        }
      }
    ]
  }
];

