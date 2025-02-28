import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      ContainerComponent, 
      RowComponent, 
      ColComponent, 
      CardGroupComponent, 
      TextColorDirective, 
      CardComponent, 
      CardBodyComponent, 
      FormDirective, 
      InputGroupComponent, 
      InputGroupTextDirective, 
      IconDirective, 
      FormControlDirective, 
      ButtonDirective, 
      NgStyle,
      CommonModule,
      FormsModule
    ]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;  // Indicateur de chargement
  errersul: boolean = false
  
  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  onLogin(): void {
    this.isLoading = true; // Active le loader
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false; // Désactive le loader après la réponse
        this.authService.saveUserToLocalStorage(response);
        console.log(response);
        this.router.navigate(['/dashboard']); // Redirige vers le tableau de bord
      },
      error: () => {
        this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
        this.isLoading = false; // Désactive le loader en cas d'erreur
        this.errersul = true
      },
    });
  }

}
