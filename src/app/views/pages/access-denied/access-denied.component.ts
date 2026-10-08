import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { PermissionService } from '../../../service/permission.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="container min-vh-100 d-flex align-items-center justify-content-center">
      <section class="text-center">
        <p class="display-1 fw-bold text-warning mb-0">403</p>
        <h1 class="h3">Accès refusé</h1>
        <p class="text-body-secondary">
          Votre rôle ne vous permet pas d’accéder à cette page.
          Contactez un administrateur si vous pensez que c’est une erreur.
        </p>
        <a class="btn btn-primary" [routerLink]="returnPath">{{ returnLabel }}</a>
      </section>
    </main>
  `
})
export class AccessDeniedComponent implements OnInit {
  returnPath = '/login';
  returnLabel = 'Retour à la connexion';

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromLocalStorage();
    const paths = [
      '/dashboard',
      '/note',
      '/temps',
      '/eleve/eleve',
      '/enseignant',
      '/supports',
      '/frais',
      '/enseigner',
      '/paiement',
      '/pointage',
      '/avance',
      '/classe',
      '/classeecole',
      '/matiere',
      '/administrateur/role',
      '/administrateur'
    ];
    const accessiblePath = paths.find(path => this.permissionService.canAccessUrl(user, path));
    if (accessiblePath) {
      this.returnPath = accessiblePath;
      this.returnLabel = 'Retour à une page autorisée';
    }
  }
}
