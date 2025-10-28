import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administrateur'
    },
    children: [
      {
        path: '',
        redirectTo: 'listes',
        pathMatch: 'full'
      },
      {
        path: 'listes',
        loadComponent: () => import('./administrateur.component').then(m => m.AdministrateurComponent),
        data: {
          title: 'Listes'
        }
      },
      {
        path: 'add-edit',
        loadComponent: () => import('./add-edit/add-edit.component').then(m => m.AddEditComponent),
        data: {
          title: 'Ajouter / Modifier'
        }
      },
      {
        path: 'add-edit/:id',
        loadComponent: () => import('./add-edit/add-edit.component').then(m => m.AddEditComponent),
        data: {
          title: 'Ajouter / Modifier'
        }
      },
      {
        path: 'role',
        loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
        data: {
          title: 'Gestion des rôles'
        }
      }
    ]
  }
];

