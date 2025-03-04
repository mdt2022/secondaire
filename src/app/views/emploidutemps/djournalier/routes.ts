import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Djournalier'
    },
    children: [
      {
        path: '',
        redirectTo: 'djournalier',
        pathMatch: 'full'
      },
      {
        path: 'djournalier',
        loadComponent: () => import('./djournalier.component').then(m => m.DjournalierComponent),
        data: {
          title: 'Djournalier'
        }
      }
    ]
  }
];

