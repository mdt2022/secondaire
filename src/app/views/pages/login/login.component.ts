import { Component, OnInit } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, CardModule } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { Ecole } from '../../../model/ecole';
import { EcoleService } from '../../../service/ecole.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      CommonModule, 
      ReactiveFormsModule, 
      ContainerComponent, 
      RowComponent, 
      ColComponent, 
      CardModule, 
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
      NgStyle
    ]
})
export class LoginComponent  implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  ecoles: Ecole[] = [];

  ngOnInit(): void {
    this.chargerEcoles();
  }

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private ecoleService: EcoleService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ecoleId: ['', Validators.required]
    });
  }
chargerEcoles(): void {
    // Appel de la méthode de votre AuthService (ou d'un EcoleService dédié)
    this.ecoleService.getAll().subscribe({
      next: (data: Ecole[]) => {
        this.ecoles = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des écoles', err);
        this.errorMessage = 'Impossible de charger la liste des établissements.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password, ecoleId } = this.loginForm.value;
    this.loading = true; // démarrer le spinner
    this.authService.login(username, password, ecoleId).subscribe({
      next: (response) => { 
        //console.log(response.user.administrateur.role.nom+"123test123")
        this.loading = false; // stop spinner
        this.authService.saveUserAndToken(response);
        if(response.user.administrateur.role.nom == 'DEV'){this.router.navigate(['/dashboard']);}
        if(response.user.administrateur.role.nom == 'AD'){this.router.navigate(['/note']);}
        if(response.user.administrateur.role.nom == 'AE2C'){this.router.navigate(['/note']);}
        if(response.user.administrateur.role.nom == 'Censeur'){this.router.navigate(['/note']);}
      },
      error: (err) => {
        this.loading = false; // stop spinner
        this.errorMessage =  err.error?.message || 'Erreur de connexion.';
      }
    });
  }

}
