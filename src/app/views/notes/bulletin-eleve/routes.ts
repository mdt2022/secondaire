import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulletin-eleve'
    },
    children: [
      {
        path: '',
        redirectTo: 'bulletin-eleve',
        pathMatch: 'full'
      },
      {
        path: 'bulletin-eleve',
        loadComponent: () => import('./bulletin-eleve.component').then(m => m.BulletinEleveComponent),
        data: {
          title: 'Bulletin-eleve'
        }
      }
    ]
  }
];

