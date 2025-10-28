import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Administrateur } from '../../../model/administrateur';
import { Role } from '../../../model/role';
import { AdministrateurService } from '../../../service/admin.service';
import { RoleService } from '../../../service/role.service';
import { Ecole } from '../../../model/ecole';
import { ActivatedRoute, Router } from '@angular/router';
import { EcoleService } from '../../../service/ecole.service';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent, 
    CardHeaderComponent, 
    CardBodyComponent,
    CommonModule,
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AddEditComponent implements OnInit{
  adminForm!: FormGroup;
  administrateurs: Administrateur[] = [];
  roles: Role[] = [];
  ecoles: Ecole[] = [];
  editMode = false;
  currentId?: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdministrateurService,
    private roleService: RoleService,
    private ecoleService: EcoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Charger les listes
    this.loadRoles();
    this.loadEcoles();
    // Vérifier si un id est présent dans l’URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = +id;
        this.editMode = true;
        this.loadAdmin(this.currentId);
      }
    });
  }
// Initialisation du formulaire
  private initForm(): void {
    this.adminForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      role: [null, Validators.required],
      ecole: [null, Validators.required],
      username: ['', Validators.required],
      password: [''],
    });
  }

  // Charger les informations de l'administrateur
  private loadAdmin(id: number): void {
    this.adminService.getById(id).subscribe({
      next: (admin: Administrateur) => {
        this.adminForm.patchValue({
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          telephone: admin.telephone,
          role: admin.role?.id,
          ecole: admin.ecole?.idEcole,
          username: admin.username,
          password: admin.password, // ne jamais afficher le mot de passe
        });
      },
      error: err => console.error('Erreur lors du chargement', err),
    });
  }

  // Charger les rôles
  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: data => (this.roles = data),
      error: err => console.error('Erreur chargement rôles', err),
    });
  }

  // Charger les écoles
  private loadEcoles(): void {
    this.ecoleService.getAll().subscribe({
      next: data => (this.ecoles = data),
      error: err => console.error('Erreur chargement écoles', err),
    });
  }

  // Enregistrement
  onSubmit(): void {
    if (this.adminForm.invalid) return;

    const formValue = this.adminForm.value;
    const payload: Administrateur = {
      ...formValue,
      role: formValue.role ? { id: formValue.role } as Role : null,
      ecole: formValue.ecole ? { idEcole: formValue.ecole } as Ecole : null,
    };

    if (this.editMode && this.currentId) {
      this.adminService.update(this.currentId, payload).subscribe({
        next: () => {
          alert('Administrateur modifié avec succès');
          this.router.navigate(['/administrateurs']);
        },
      });
    } else {
      this.adminService.create(payload).subscribe({
        next: () => {
          alert('Administrateur ajouté avec succès');
          this.router.navigate(['/administrateurs']);
        },
      });
    }
  }

  edit(admin: Administrateur): void {
    this.editMode = true;
    this.currentId = admin.id;
    this.adminForm.patchValue(admin);
  }

  resetForm(): void {
    this.adminForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
