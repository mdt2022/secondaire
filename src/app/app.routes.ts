import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { permissionGuard } from './service/permission.service';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivateChild: [permissionGuard],
    data: {
      title: 'Accueil'
    },
    children: [
      {
        path: 'avance',
        redirectTo: 'configuration/avance'
      },
      {
        path: 'supports',
        loadChildren: () => import('./views/supportdecours/routes').then((m) => m.routes)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./views/configuration/routes').then(m => m.routes)
      },
      {
        path: 'administrateur',
        loadChildren: () => import('./views/administrateur/routes').then((m) => m.routes)
      },
      {
        path: 'classe',
        redirectTo: 'configuration/classe'
      },
      {
        path: 'matiere',
        redirectTo: 'configuration/matiere'
      },
      {
        path: 'classeecole',
        redirectTo: 'configuration/classeecole'
      },
      {
        path: 'eleve',
        loadChildren: () => import('./views/eleve/routes').then((m) => m.routes)
      },
      {
        path: 'enseignant',
        loadChildren: () => import('./views/enseignant/routes').then((m) => m.routes)
      },
      {
        path: 'temps',
        loadChildren: () => import('./views/temps/routes').then((m) => m.routes)
      },
      {
        path: 'frais',
        loadChildren: () => import('./views/frais/routes').then((m) => m.routes)
      },
      {
        path: 'enseigner',
        loadChildren: () => import('./views/enseigner/routes').then((m) => m.routes)
      },
      {
        path: 'note',
        loadChildren: () => import('./views/note/routes').then((m) => m.routes)
      },
      {
        path: 'paiement',
        loadChildren: () => import('./views/paiement/routes').then((m) => m.routes)
      },
      {
        path: 'pointage',
        loadChildren: () => import('./views/pointage/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: 'acces-refuse',
    loadComponent: () => import('./views/pages/access-denied/access-denied.component').then(m => m.AccessDeniedComponent),
    data: {
      title: 'Accès refusé'
    }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
