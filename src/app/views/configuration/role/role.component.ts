import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Role } from '../../../model/role';
import { RoleService } from '../../../service/role.service';
import { permissionActions, permissionModules } from '../../../service/permission.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {

  roles: Role[] = [];
  form!: FormGroup;

  editing = false;
  editingId: number | null = null;
  readonly modules = permissionModules;
  readonly actions = permissionActions;
  selectedPermissions = new Set<string>();

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      categorieId: [null]
    });
  }

  ngOnInit(): void {
    this.load();
  }


  load(): void {
    this.roleService.getAll().subscribe({
      next: data => this.roles = data,
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les rôles', 'error');
      }
    });
  }


  startCreate(): void {
    this.editing = false;
    this.editingId = null;
    this.selectedPermissions = new Set<string>();
    this.form.reset();
  }


  startEdit(role: Role): void {
    this.editing = true;
    this.editingId = role.id ?? null;

    this.form.patchValue({
      nom: role.nom,
      description: role.description,
      categorieId: role.categorie ? role.categorie.id : null
    });
    this.selectedPermissions = new Set(
      role.permissionsConfigured
        ? role.permissions ?? []
        : this.permissionsParDefaut(role.nom)
    );
  }

  permissionCode(moduleCode: string, actionCode: string): string {
    return `${moduleCode}:${actionCode}`;
  }

  permissionActive(moduleCode: string, actionCode: string): boolean {
    return this.selectedPermissions.has(this.permissionCode(moduleCode, actionCode));
  }

  onPermissionChange(moduleCode: string, actionCode: string, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const permission = this.permissionCode(moduleCode, actionCode);
    if (target.checked) this.selectedPermissions.add(permission);
    else this.selectedPermissions.delete(permission);
  }

  private permissionsParDefaut(roleName: string): string[] {
    const normalizedName = roleName.trim().toUpperCase();
    const excludedModules = normalizedName === 'DEV'
      ? []
      : normalizedName === 'TEST'
        ? ['AVANCES', 'ADMINISTRATEURS', 'CLASSES', 'AFFECTATIONS_CLASSES', 'MATIERES']
        : ['AVANCES', 'ADMINISTRATEURS', 'CLASSES', 'AFFECTATIONS_CLASSES', 'MATIERES'];
    const modules = normalizedName === 'DEV'
      ? this.modules
      : this.modules.filter(module => !excludedModules.includes(module.code));
    return modules.flatMap(module =>
      this.actions.map(action => this.permissionCode(module.code, action.code))
    );
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir correctement les champs obligatoires'
      });
      return;
    }

    const payload: Role = {
      nom: this.form.value.nom,
      description: this.form.value.description,
      categorie: this.form.value.categorieId
        ? { id: this.form.value.categorieId }
        : null,
      permissions: [...this.selectedPermissions],
      permissionsConfigured: true
    };

    if (this.editing && this.editingId) {
      this.roleService.update(this.editingId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie',
            text: 'Le rôle a été mis à jour. Les utilisateurs concernés doivent se reconnecter pour actualiser leur menu.',
            timer: 1500,
            showConfirmButton: false
          });
          this.load();
          this.form.reset();
          this.editing = false;
          this.editingId = null;
          this.selectedPermissions.clear();
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la modification du rôle', 'error');
        }
      });

    } else {
      this.roleService.create(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Création réussie',
            text: 'Le rôle a été créé avec succès',
            timer: 1500,
            showConfirmButton: false
          });
          this.load();
          this.form.reset();
          this.selectedPermissions.clear();
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la création du rôle', 'error');
        }
      });
    }
  }


  deleteRole(id?: number): void {
    if (!id) return;

    Swal.fire({
      title: 'Suppression',
      text: 'Voulez-vous vraiment supprimer ce rôle ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {

      if (result.isConfirmed) {
        this.roleService.delete(id).subscribe({

          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé',
              text: 'Le rôle a été supprimé avec succès',
              timer: 1500,
              showConfirmButton: false
            });
            this.load();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer ce rôle car il est lié a un administrateur'
            });
          }

        });
      }

    });
  }
}
