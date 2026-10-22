import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Ecole, EcolePayload } from '../../../model/ecole';
import { EcoleService } from '../../../service/ecole.service';

@Component({
  selector: 'app-ecole',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ecole.component.html'
})
export class EcoleComponent implements OnInit {
  ecoles: Ecole[] = [];
  filteredEcoles: Ecole[] = [];
  ecoleForm: FormGroup;

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  editMode = false;
  isLoading = false;
  isSaving = false;
  currentEcole?: Ecole;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ecoleService: EcoleService
  ) {
    this.ecoleForm = this.formBuilder.nonNullable.group({
      nomEcole: ['', Validators.required],
      descriptionEcole: [''],
      adresseEcole: ['']
    });
  }

  ngOnInit(): void {
    this.loadEcoles();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEcoles.length / this.pageSize));
  }

  get paginatedEcoles(): Ecole[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEcoles.slice(start, start + this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  loadEcoles(): void {
    this.isLoading = true;
    this.ecoleService.getAll().subscribe({
      next: ecoles => {
        this.ecoles = ecoles;
        this.applyFilter();
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        Swal.fire('Erreur', this.errorMessage(error, 'Impossible de charger les écoles.'), 'error');
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    this.filteredEcoles = this.ecoles.filter(ecole =>
      !term || [
        ecole.idEcole,
        ecole.nomEcole,
        ecole.descriptionEcole,
        ecole.adresseEcole
      ].some(value => value?.toString().toLocaleLowerCase().includes(term))
    );
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  edit(ecole: Ecole): void {
    this.currentEcole = ecole;
    this.editMode = true;
    this.ecoleForm.patchValue({
      nomEcole: ecole.nomEcole,
      descriptionEcole: ecole.descriptionEcole ?? '',
      adresseEcole: ecole.adresseEcole ?? ''
    });
  }

  save(): void {
    if (this.ecoleForm.invalid) {
      this.ecoleForm.markAllAsTouched();
      return;
    }

    const payload: EcolePayload = {
      ...this.ecoleForm.getRawValue(),
      ...(this.currentEcole
        ? {
            idEcole: this.currentEcole.idEcole,
            categorie: this.currentEcole.categorie ?? null
          }
        : {})
    };
    this.isSaving = true;

    const request = this.currentEcole
      ? this.ecoleService.update(this.currentEcole.idEcole, payload)
      : this.ecoleService.create(payload);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire(
          this.editMode ? 'Modifiée' : 'Ajoutée',
          `L’école a été ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès.`,
          'success'
        );
        this.resetForm();
        this.loadEcoles();
      },
      error: error => {
        this.isSaving = false;
        Swal.fire('Erreur', this.errorMessage(error, 'Impossible d’enregistrer cette école.'), 'error');
      }
    });
  }

  delete(ecole: Ecole): void {
    Swal.fire({
      title: 'Supprimer cette école ?',
      text: `L’école « ${ecole.nomEcole} » sera supprimée.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.ecoleService.delete(ecole.idEcole).subscribe({
        next: () => {
          Swal.fire('Supprimée', 'L’école a été supprimée.', 'success');
          this.loadEcoles();
        },
        error: error => {
          Swal.fire('Suppression impossible', this.errorMessage(error, 'Cette école ne peut pas être supprimée.'), 'error');
        }
      });
    });
  }

  resetForm(): void {
    this.ecoleForm.reset({
      nomEcole: '',
      descriptionEcole: '',
      adresseEcole: ''
    });
    this.currentEcole = undefined;
    this.editMode = false;
  }

  private errorMessage(error: { error?: unknown }, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
    if (
      typeof error.error === 'object'
      && error.error !== null
      && 'message' in error.error
      && typeof error.error.message === 'string'
    ) {
      return error.error.message;
    }
    return fallback;
  }
}
