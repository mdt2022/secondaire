import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { NouvelleEmpreinteComponent } from './views/avance/nouvelle-empreinte/nouvelle-empreinte.component';
import { EnregistrerFraiComponent } from './views/fraisecondaire/enregistrer-frai/enregistrer-frai.component';
import { MatierecreationComponent } from './views/matieres/matierecreation/matierecreation.component';
import { EnseignercreateComponent } from './views/matieresenseignees/enseignercreate/enseignercreate.component';
import { ProfComponent } from './views/emploidutemps/prof/prof.component';
import { ClasseemploiComponent } from './views/emploidutemps/classeemploi/classeemploi.component';
import { CreationemploidutempsComponent } from './views/emploidutemps/creationemploidutemps/creationemploidutemps.component';
import { DjournalierComponent } from './views/emploidutemps/djournalier/djournalier.component';
import { SemaineprofComponent } from './views/emploidutemps/semaineprof/semaineprof.component';
import { ElevecreationComponent } from './views/eleves/elevecreation/elevecreation.component';
import { ListeelevesComponent } from './views/eleves/listeeleves/listeeleves.component';
import { PassageeleveComponent } from './views/eleves/passageeleve/passageeleve.component';
import { ListepassageComponent } from './views/eleves/passageeleve/listepassage/listepassage.component';
import { RedoubleeleveComponent } from './views/eleves/redoubleeleve/redoubleeleve.component';
import { ListeredoubleComponent } from './views/eleves/redoubleeleve/listeredouble/listeredouble.component';
import { PointageRechercheComponent } from './views/pointages/pointage-recherche/pointage-recherche.component';
import { PointageEnseignantComponent } from './views/pointages/pointage-enseignant/pointage-enseignant.component';
import { BulletinClasseComponent } from './views/notes/bulletin-classe/bulletin-classe.component';
import { BulletinEleveComponent } from './views/notes/bulletin-eleve/bulletin-eleve.component';
import { NoteClasseComponent } from './views/notes/note-classe/note-classe.component';
import { NoteEleveComponent } from './views/notes/note-eleve/note-eleve.component';
import { NoteMatieresComponent } from './views/notes/note-matieres/note-matieres.component';
import { ReleverComponent } from './views/notes/relever/relever.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
      { path: 'matierecreation/:id', component: MatierecreationComponent },
      { path: 'enseignercreate', component: EnseignercreateComponent },
      { path: 'prof', component: ProfComponent },
      { path: 'classeemploi', component: ClasseemploiComponent },
      { path: 'creationemploidutemps', component: CreationemploidutempsComponent },
      { path: 'djournalier', component: DjournalierComponent },
      { path: 'semaineprof', component: SemaineprofComponent },
      { path: 'elevecreation', component: ElevecreationComponent},
      { path: 'listeeleves', component: ListeelevesComponent},
      { path: 'passageeleve', component: PassageeleveComponent},
      { path: 'listepassage', component: ListepassageComponent},
      { path: 'redoubleeleve', component: RedoubleeleveComponent},
      { path: 'listeredouble', component: ListeredoubleComponent},
      { path: 'pointage-recherche', component:PointageRechercheComponent},
      { path: 'bulletin-classe', component:BulletinClasseComponent},
      { path: 'bulletin-eleve', component:BulletinEleveComponent},
      { path: 'note-classe', component:NoteClasseComponent},
      { path: 'note-eleve', component:NoteEleveComponent},
      { path: 'note-matieres', component:NoteMatieresComponent},
      { path: 'relever', component:ReleverComponent},
      { path: 'pointage-enseignant', component:PointageEnseignantComponent},





      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },{
        path: 'administrateur',
        loadChildren: () => import('./views/administrateur/routes').then((m) => m.routes)
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
        path: 'roles',
        loadChildren: () => import('./views/role/routes').then((m) => m.routes)
      },
      {
        path: 'gestionsdesclasses',
        loadChildren: () => import('./views/gestionsdesclasses/routes').then((m) => m.routes)
      },
      {
        path: 'administrateur',
        loadChildren: () => import('./views/administrateur/routes').then((m) => m.routes)
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
