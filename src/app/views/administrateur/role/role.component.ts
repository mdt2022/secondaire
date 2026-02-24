import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Role } from '../../../model/role';
import { RoleService } from '../../../service/role.service';

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

  errorMessage: string | null = null;

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
        this.errorMessage = 'Impossible de charger les rôles';
        Swal.fire('Erreur', 'Impossible de charger les rôles', 'error');
      }
    });
  }


  startCreate(): void {
    this.editing = false;
    this.editingId = null;
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
        : null
    };

    if (this.editing && this.editingId) {
      this.roleService.update(this.editingId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie',
            text: 'Le rôle a été mis à jour',
            timer: 1500,
            showConfirmButton: false
          });
          this.load();
          this.form.reset();
          this.editing = false;
          this.editingId = null;
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
