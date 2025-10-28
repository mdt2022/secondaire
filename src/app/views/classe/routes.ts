import { Routes } from '@angular/router';

import { ClasseComponent } from './classe.component';

export const routes: Routes = [
  {
    path: '',
    component: ClasseComponent,
    data: {
      title: 'Gestion des Classes'
    }
  }
];
