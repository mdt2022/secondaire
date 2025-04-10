import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Note-matieres'
    },
    children: [
      {
        path: '',
        redirectTo: 'note-matieres',
        pathMatch: 'full'
      },
      {
        path: 'note-matieres',
        loadComponent: () => import('./note-matieres.component').then(m => m.NoteMatieresComponent),
        data: {
          title: 'Note-matiere'
        }
      }
    ]
  }
];

