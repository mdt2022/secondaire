import { Component } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, CardModule } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, CardModule, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {

 loginForm: FormGroup;
 errorMessage = '';
 loading = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    this.loading = true; // démarrer le spinner
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false; // stop spinner
        this.authService.saveUserAndToken(response);
        if(response.user.administrateur.role.nom == 'AD'){
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.loading = false; // stop spinner
        this.errorMessage = 'Erreur de connexion.';
      }
    });
  }

}
