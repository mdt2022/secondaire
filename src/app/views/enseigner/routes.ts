import { Routes } from '@angular/router';

import { EnseignerComponent } from './enseigner.component';

export const routes: Routes = [
  {
    path: '',
    component: EnseignerComponent,
    data: {
      title: 'Matières enseignées'
    }
  }
];
