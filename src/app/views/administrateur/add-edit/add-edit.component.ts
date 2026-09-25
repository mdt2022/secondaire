import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Administrateur, AffectationAdministrateur } from '../../../model/administrateur';
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
      affectations: this.fb.array([]),
      username: ['', Validators.required],
      password: [''],
    });
    this.ajouterAffectation();
  }

  private loadAdmin(id: number): void {
    this.adminService.getById(id).subscribe({
      next: (admin: Administrateur) => {
        this.adminForm.patchValue({
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          telephone: admin.telephone,
          username: admin.username,
          password: '', // ne jamais afficher le mot de passe
        });
        this.affectations.clear();
        const affectations = admin.affectations?.length
          ? admin.affectations
          : (admin.ecole && admin.role ? [{ ecole: admin.ecole, role: admin.role }] : []);
        affectations.forEach(affectation =>
          this.ajouterAffectation(affectation.ecole.idEcole, affectation.role.id)
        );
        if (!this.affectations.length) this.ajouterAffectation();
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
    const affectations: AffectationAdministrateur[] = formValue.affectations.map((affectation: { ecole: number; role: number }) => ({
      ecole: { idEcole: affectation.ecole } as Ecole,
      role: { id: affectation.role } as Role,
    }));
    const payload: Administrateur = {
      ...formValue,
      affectations,
      role: affectations[0].role,
      ecole: affectations[0].ecole,
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

  get affectations(): FormArray {
    return this.adminForm.get('affectations') as FormArray;
  }

  ajouterAffectation(ecoleId: number | null = null, roleId: number | null = null): void {
    this.affectations.push(this.fb.group({
      ecole: [ecoleId, Validators.required],
      role: [roleId, Validators.required]
    }));
  }

  supprimerAffectation(index: number): void {
    if (this.affectations.length > 1) {
      this.affectations.removeAt(index);
    }
  }
}
