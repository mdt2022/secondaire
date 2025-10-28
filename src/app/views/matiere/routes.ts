import { Routes } from '@angular/router';

import { MatiereComponent } from './matiere.component';

export const routes: Routes = [
  {
    path: '',
    component: MatiereComponent,
    data: {
      title: 'Gestion des Matières'
    }
  }
];
