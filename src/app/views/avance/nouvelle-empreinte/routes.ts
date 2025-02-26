import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'NouvelleEmpreinte'
    },
    children: [
      {
        path: '',
        redirectTo: 'nouvelle-empreinte',
        pathMatch: 'full'
      },
      {
        path: 'nouvelle-empreinte',
        loadComponent: () => import('./nouvelle-empreinte.component').then(m => m.NouvelleEmpreinteComponent),
        data: {
          title: 'NouvelleEmpreinte'
        }
      }
    ]
  }
];

