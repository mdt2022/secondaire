import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Note-eleve'
    },
    children: [
      {
        path: '',
        redirectTo: 'note-eleve',
        pathMatch: 'full'
      },
      {
        path: 'note-eleve',
        loadComponent: () => import('./note-eleve.component').then(m => m.NoteEleveComponent),
        data: {
          title: 'Note-eleve'
        }
      }
    ]
  }
];

