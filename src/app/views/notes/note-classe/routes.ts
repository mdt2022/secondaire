import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Note-classe'
    },
    children: [
      {
        path: '',
        redirectTo: 'note-classe',
        pathMatch: 'full'
      },
      {
        path: 'note-classe',
        loadComponent: () => import('./note-classe.component').then(m => m.NoteClasseComponent),
        data: {
          title: 'Note-classe'
        }
      }
    ]
  }
];

