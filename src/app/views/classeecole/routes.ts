import { Routes } from '@angular/router';

import { ClasseecoleComponent } from './classeecole.component';

export const routes: Routes = [
  {
    path: '',
    component: ClasseecoleComponent,
    data: {
      title: 'Affecter une Classe'
    }
  }
];
