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
        redirectTo: 'note',
        pathMatch: 'full'
      },
      {
        path: 'note',
        loadComponent: () => import('./note.component').then(m => m.NoteComponent),
        data: {
          title: 'Gestion des notes'
        }
      }/*,
      {
        path: 'brands',
        loadComponent: () => import('./coreui-icons.component').then(m => m.CoreUIIconsComponent),
        data: {
          title: 'Brands'
        }
      },
      {
        path: 'flags',
        loadComponent: () => import('./coreui-icons.component').then(m => m.CoreUIIconsComponent),
        data: {
          title: 'Flags'
        }
      }*/
    ]
  }
];
