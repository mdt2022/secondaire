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
      },
      {
        path: 'classe',
        loadComponent: () => import('./classe/classe.component').then(m => m.ClasseComponent),
        data:{
          title: 'Note par classe'
        }
      }
    ]
  }
];

