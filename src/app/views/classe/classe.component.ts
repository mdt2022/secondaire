import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Classe } from '../../model/classe';
import { ClasseService } from '../../service/classe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = [];
  filteredClasses: Classe[] = [];
  paginatedClasses: Classe[] = [];
  classeForm!: FormGroup;
  editMode = false;
  currentId?: number;

  // Pagination
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;

  // Tri
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private classeService: ClasseService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.classeForm = this.fb.group({
      nom: ['', Validators.required],
      filiere: [''],
      options: [''],
      description: ['']
    });

    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getAll().subscribe(data => {
      this.classes = data;
      this.applyFilter();
    });
  }

  save(): void {
    const classe: Classe = this.classeForm.value;

    if (this.editMode && this.currentId) {
      this.classeService.update(this.currentId, classe).subscribe(() => {
        Swal.fire('Modifié!', 'La classe a été modifiée avec succès.', 'success');
        this.loadClasses();
        this.resetForm();
      });
    } else {
      this.classeService.create(classe).subscribe(() => {
        Swal.fire('Ajouté!', 'La classe a été ajoutée avec succès.', 'success');
        this.loadClasses();
        this.resetForm();
      });
    }
  }

  edit(classe: Classe): void {
    this.editMode = true;
    this.currentId = classe.id;
    this.classeForm.patchValue(classe);
  }

delete(id: number) {
  Swal.fire({
    title: 'Voulez-vous vraiment supprimer cette classe ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.classeService.delete(id).subscribe({
        next: () => {
          Swal.fire('Supprimé !', 'La classe a été supprimée.', 'success');
          this.loadClasses(); 
        },
        error: (err) => {
          let message = 'Une erreur est survenue';
          if (err.error) {
            message = err.error; 
          }
          Swal.fire('Erreur', message, 'error');
        }
      });
    }
  });
}
  resetForm(): void {
    this.editMode = false;
    this.currentId = undefined;
    this.classeForm.reset();
  }

  applyFilter(): void {
    const term = this.searchTerm?.toLowerCase() || '';
    this.filteredClasses = this.classes.filter(c =>
      (c.nom?.toLowerCase().includes(term) ?? false) ||
      (c.filiere?.toLowerCase().includes(term) ?? false) ||
      (c.options?.toLowerCase().includes(term) ?? false) ||
      (c.description?.toLowerCase().includes(term) ?? false)
    );

    if (this.sortField) {
      this.sort(this.sortField, false); 
    } else {
      this.totalPages = Math.ceil(this.filteredClasses.length / this.pageSize);
      this.changePage(1);
    }
  }

  sort(field: string, toggle: boolean = true): void {
    if (toggle) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    }

    this.filteredClasses.sort((a: any, b: any) => {
      const valA = (a[field] ?? '').toString().toLowerCase();
      const valB = (b[field] ?? '').toString().toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.totalPages = Math.ceil(this.filteredClasses.length / this.pageSize);
    this.changePage(1);
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  changePage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClasses = this.filteredClasses.slice(start, end);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
