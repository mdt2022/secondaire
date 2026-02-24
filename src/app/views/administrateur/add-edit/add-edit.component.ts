import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Administrateur } from '../../../model/administrateur';
import { Role } from '../../../model/role';
import { Ecole } from '../../../model/ecole';
import { AdministrateurService } from '../../../service/admin.service';
import { RoleService } from '../../../service/role.service';
import { EcoleService } from '../../../service/ecole.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  adminForm!: FormGroup;
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
    this.loadRoles();
    this.loadEcoles();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = +id;
        this.editMode = true;
        this.loadAdmin(this.currentId);
      }
    });
  }

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
          password: '', // ne jamais afficher le mot de passe
        });
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger l’administrateur', 'error')
    });
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: data => this.roles = data,
      error: () => Swal.fire('Erreur', 'Impossible de charger les rôles', 'error')
    });
  }

  private loadEcoles(): void {
    this.ecoleService.getAll().subscribe({
      next: data => this.ecoles = data,
      error: () => Swal.fire('Erreur', 'Impossible de charger les écoles', 'error')
    });
  }

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
          Swal.fire({
            icon: 'success',
            title: 'Modifié',
            text: 'Administrateur mis à jour avec succès',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/administrateurs']);
        },
        error: () => Swal.fire('Erreur', 'Impossible de modifier cet administrateur', 'error')
      });
    } else {
      this.adminService.create(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Créé',
            text: 'Administrateur ajouté avec succès',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/administrateurs']);
        },
        error: () => Swal.fire('Erreur', 'Impossible de créer cet administrateur', 'error')
      });
    }
  }

  resetForm(): void {
    this.adminForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
