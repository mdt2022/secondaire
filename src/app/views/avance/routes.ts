import { Routes } from '@angular/router';
import { AvanceComponent } from './avance.component';

export const routes: Routes = [
  {
    path: '',
    component: AvanceComponent,
    data: {
      title: 'Avance'
    }
  }
];