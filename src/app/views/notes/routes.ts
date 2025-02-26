import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notes'
    },
    children: [
      {
        path: '',
        redirectTo: 'notes',
        pathMatch: 'full'
      },
      {
        path: 'notes',
        loadComponent: () => import('./notes.component').then(m => m.NotesComponent),
        data: {
          title: 'Notes'
        }
      }
    ]
  }
];

