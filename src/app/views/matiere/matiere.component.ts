import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatiereService } from '../../service/matiere.service';
import { Matiere } from '../../model/matiere';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CardModule, ButtonModule, TableModule],
  templateUrl: './matiere.component.html',
})
export class MatiereComponent implements OnInit {

  matieres: Matiere[] = [];
  matiereForm!: FormGroup;
  editMode = false;
  currentId?: number;

  filteredMatieres: Matiere[] = [];

searchTerm = '';
sortField: keyof Matiere = 'libelle';
sortDirection: 'asc' | 'desc' = 'asc';

currentPage = 1;
pageSize = 20;
totalPages = 1;
totalPagesArray: number[] = [];

  constructor(private fb: FormBuilder, private matiereService: MatiereService) {}

  ngOnInit(): void {
    this.loadMatieres();

    this.matiereForm = this.fb.group({
      libelle: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0)]],
      horaire: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadMatieres() {
  this.matiereService.getAll().subscribe(data => {
    this.matieres = data;
    this.applyFilter();
  });
}

applyFilter() {
  let data = [...this.matieres];

  //  FILTRE
  if (this.searchTerm && this.searchTerm.trim() !== '') {
    const term = this.searchTerm.toLowerCase();

    data = data.filter(m =>
      (m.libelle ?? '').toLowerCase().includes(term)
    );
  }

  // TRI
  data.sort((a: any, b: any) => {
    const valueA = (a[this.sortField] ?? '').toString().toLowerCase();
    const valueB = (b[this.sortField] ?? '').toString().toLowerCase();

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  //  PAGINATION
  this.totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));
  this.totalPagesArray = Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

  const start = (this.currentPage - 1) * this.pageSize;
  this.filteredMatieres = data.slice(start, start + this.pageSize);
}
sort(field: keyof Matiere) {
  if (this.sortField === field) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortField = field;
    this.sortDirection = 'asc';
  }
  this.applyFilter();
}

sortIcon(field: keyof Matiere): string {
  if (this.sortField !== field) return '';
  return this.sortDirection === 'asc' ? '▲' : '▼';
}

changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.applyFilter();
}
onSubmit() {
  if (this.matiereForm.invalid) {
    this.matiereForm.markAllAsTouched();
    return;
  }

  const payload: Matiere = this.matiereForm.value;

  if (this.editMode && this.currentId) {
    this.matiereService.update(this.currentId, payload).subscribe({
      next: () => {
        this.loadMatieres();
        this.resetForm();
      }
    });
  } else {
    this.matiereService.create(payload).subscribe({
      next: () => {
        this.loadMatieres();
        this.resetForm();
      }
    });
  }
}
  edit(matiere: Matiere) {
    this.editMode = true;
    this.currentId = matiere.id;
    this.matiereForm.patchValue({
      libelle: matiere.libelle,
      coefficient: matiere.coefficient,
      horaire: matiere.horaire
    });
  }

  delete(id: number) {

  Swal.fire({
    title: 'Suppression',
    text: 'Voulez-vous vraiment supprimer cette matière ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {

    if (result.isConfirmed) {
      this.matiereService.delete(id).subscribe({

        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'La matière a été supprimée avec succès',
            timer: 1500,
            showConfirmButton: false
          });
          this.loadMatieres();
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Suppression impossible',
            text: err.error || 'Cette matière est déjà utilisée',
          });
        }

      });
    }

  });
}

  resetForm() {
    this.matiereForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
