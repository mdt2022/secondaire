import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Supports'
    },
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./supportdecours.component').then(m => m.SupportdecoursComponent),
        data: {
          title: 'Gestion des supports'
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./add-edit/add-edit.component').then(m => m.AddEditComponent),
        data: {
          title: 'Ajouter*Modifier'
        }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./add-edit/add-edit.component').then(m => m.AddEditComponent),
        data: {
          title: 'Ajouter*Modifier'
        }
      },
      {
        path: 'classes/:id',
        loadComponent: () => import('./classes/classes.component').then(m => m.ClassesComponent),
        data: {
          title: 'Les matières par classe'
        }
      },
      {
        path: 'gestion/:id',
        loadComponent: () => import('./gestion/gestion.component').then(m => m.GestionComponent),
        data: {
          title: 'Gestion des contenues'
        }
      }
    ]
  }
];


