import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Notes' },
    children: [
      {
        path: '',
        redirectTo: 'note',
        pathMatch: 'full'
      },
      {
        path: 'note',
        loadComponent: () =>
          import('./note.component').then(m => m.NoteComponent)
      },
      {
        path: 'par-classe',
        loadComponent: () =>
          import('./notes-classe/notes-classe.component').then(m => m.NotesClasseComponent)
      },
      {
        path: 'eleve',
        loadComponent: () =>
          import('./notes-eleve/notes-eleve.component').then(m => m.NotesEleveComponent)
      },
      {
        path: 'matiere',
        loadComponent: () =>
          import('./notes-matiere/notes-matiere.component').then(m => m.NotesMatiereComponent)
      },
      {
        path: 'releve',
        loadComponent: () =>
          import('./relever/relever.component').then(m => m.ReleverComponent)
      },
      {
        path: 'bulletin-eleve',
        loadComponent: () =>
          import('./bulletin-eleve/bulletin-eleve.component').then(m => m.BulletinEleveComponent)
      },
      {
        path: 'bulletin-classe',
        loadComponent: () =>
          import('./bulletins-classe/bulletins-classe.component').then(m => m.BulletinsClasseComponent)
      }
    ]
  }
];
