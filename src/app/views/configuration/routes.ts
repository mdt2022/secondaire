import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Configuration' },
    children: [
      {
        path: '',
        loadComponent: () => import('./configuration.component').then(m => m.ConfigurationComponent),
        data: { title: 'Gestion des configurations' }
      },
      {
        path: 'avance',
        loadComponent: () => import('./avance/avance.component').then(m => m.AvanceComponent),
        data: { title: 'Avances' }
      },
      {
        path: 'role',
        loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
        data: { title: 'Rôles et permissions' }
      },
      {
        path: 'classe',
        loadComponent: () => import('./classe/classe.component').then(m => m.ClasseComponent),
        data: { title: 'Classes' }
      },
      {
        path: 'classeecole',
        loadComponent: () => import('./classeecole/classeecole.component').then(m => m.ClasseecoleComponent),
        data: { title: 'Affectations de classes' }
      },
      {
        path: 'matiere',
        loadComponent: () => import('./matiere/matiere.component').then(m => m.MatiereComponent),
        data: { title: 'Matières' }
      }
    ]
  }
];
