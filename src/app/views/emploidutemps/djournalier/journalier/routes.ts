import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Journalier'
    },
    children: [
      {
        path: '',
        redirectTo: 'journalier',
        pathMatch: 'full'
      },
      {
        path: 'journalier',
        loadComponent: () => import('./journalier.component').then(m => m.JournalierComponent),
        data: {
          title: 'Journalier'
        }
      }
    ]
  }
];

