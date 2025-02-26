import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { NouvelleEmpreinteComponent } from './views/avance/nouvelle-empreinte/nouvelle-empreinte.component';
import { EnregistrerFraiComponent } from './views/fraisecondaire/enregistrer-frai/enregistrer-frai.component';
import { MatierecreationComponent } from './views/matieres/matierecreation/matierecreation.component';
import { EnseignercreateComponent } from './views/matieresenseignees/enseignercreate/enseignercreate.component';
import { ProfesseurcreateComponent } from './views/professeurs/professeurcreate/professeurcreate.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Accueil'
    },
    children: [
      { path: 'nouvelle-empreinte', component: NouvelleEmpreinteComponent },
      { path: 'enregistrer-frai', component: EnregistrerFraiComponent },
      { path: 'matierecreation', component: MatierecreationComponent },
      { path: 'enseignercreate', component: EnseignercreateComponent },
      { path: 'professeurcreate', component: ProfesseurcreateComponent },

      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'avance',
        loadChildren: () => import('./views/avance/routes').then((m) => m.routes)
      },
      {
        path: 'classe',
        loadChildren: () => import('./views/classe/routes').then((m) => m.routes)
      },
      {
        path: 'eleves',
        loadChildren: () => import('./views/eleves/routes').then((m) => m.routes)
      },
      {
        path: 'emploidutemps',
        loadChildren: () => import('./views/emploidutemps/routes').then((m) => m.routes)
      },
      {
        path: 'fraisecondaire',
        loadChildren: () => import('./views/fraisecondaire/routes').then((m) => m.routes)
      },
      {
        path: 'gestionsdesclasses',
        loadChildren: () => import('./views/gestionsdesclasses/routes').then((m) => m.routes)
      },
      {
        path: 'matieres',
        loadChildren: () => import('./views/matieres/routes').then((m) => m.routes)
      },
      {
        path: 'matieresenseignees',
        loadChildren: () => import('./views/matieresenseignees/routes').then((m) => m.routes)
      },
      {
        path: 'notes',
        loadChildren: () => import('./views/notes/routes').then((m) => m.routes)
      },
      {
        path: 'paiementsecondaires',
        loadChildren: () => import('./views/paiementsecondaires/routes').then((m) => m.routes)
      },
      {
        path: 'pointages',
        loadChildren: () => import('./views/pointages/routes').then((m) => m.routes)
      },
      {
        path: 'professeurs',
        loadChildren: () => import('./views/professeurs/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
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
