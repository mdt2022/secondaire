import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulletin-classe'
    },
    children: [
      {
        path: '',
        redirectTo: 'bulletin-classe',
        pathMatch: 'full'
      },
      {
        path: 'bulletin-classe',
        loadComponent: () => import('./bulletin-classe.component').then(m => m.BulletinClasseComponent),
        data: {
          title: 'Bulletin-classe'
        }
      }
    ]
  }
];

