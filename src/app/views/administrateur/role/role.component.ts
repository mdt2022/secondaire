import { Component, OnInit } from '@angular/core';
import { Role } from '../../../model/role';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../../service/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- obligatoire pour formGroup
    FormsModule          // <-- optionnel mais utile pour ngModel
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
      categorieId: [null] // si tu veux lier uniquement l'id categorie
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.roleService.getAll().subscribe({
      next: data => this.roles = data,
      error: err => this.errorMessage = 'Impossible de charger les rôles'
    });
  }

  startCreate() {
    this.editing = false;
    this.editingId = null;
    this.form.reset();
  }

  startEdit(role: Role) {
    this.editing = true;
    this.editingId = role.id ?? null;
    this.form.patchValue({
      nom: role.nom,
      description: role.description,
      categorieId: role.categorie ? role.categorie.id : null
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload: Role = {
      nom: this.form.value.nom,
      description: this.form.value.description,
      categorie: this.form.value.categorieId ? { id: this.form.value.categorieId } : null
    };
    if (this.editing && this.editingId) {
      this.roleService.update(this.editingId, payload).subscribe({
        next: () => { this.load(); this.form.reset(); this.editing = false; this.editingId = null; },
        error: () => this.errorMessage = 'Erreur lors de la modification'
      });
    } else {
      this.roleService.create(payload).subscribe({
        next: () => { this.load(); this.form.reset(); },
        error: () => this.errorMessage = 'Erreur lors de la création'
      });
    }
  }

  deleteRole(id?: number) {
    if (!id) return;
    if (!confirm('Supprimer ce rôle ?')) return;
    this.roleService.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.errorMessage = 'Erreur lors de la suppression'
    });
  }
}
