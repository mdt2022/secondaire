import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../model/enseignant';
import { EnseignantService } from '../../service/enseignant.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, ButtonModule, TableModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    FormModule
  ],
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.scss'
})
export class EnseignantComponent implements OnInit {

  enseignants: Enseignant[] = [];
  filteredEnseignants: Enseignant[] = [];
  pagedEnseignants: Enseignant[] = [];

  enseignantForm!: FormGroup;

  editMode = false;
  currentId?: number;
  selectedPhoto: string | ArrayBuffer | null = null;

  searchTerm = '';
  page = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService
  ) { }

  ngOnInit(): void {
    this.loadEnseignants();

    this.enseignantForm = this.fb.group({
      matricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lieun: ['', Validators.required],
      datedn: ['', Validators.required],
      photo: [''],
      ecole: [null],
      tarif: [0, Validators.required]
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
      this.applyFilter();
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value || '';
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredEnseignants = this.enseignants.filter(e =>
      e.nom.toLowerCase().includes(term) ||
      e.prenom.toLowerCase().includes(term) ||
      e.matricule.toLowerCase().includes(term) ||
      e.telephone.toLowerCase().includes(term)
    );

    this.page = 1;
    this.updatePage();
  }
  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEnseignants = this.filteredEnseignants.slice(
      start,
      start + this.pageSize
    );
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.filteredEnseignants.length) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  onSubmit(): void {
    if (this.enseignantForm.invalid) return;

    const data = {
      ...this.enseignantForm.value,
      photo: this.selectedPhoto
    };

    if (this.editMode && this.currentId) {
      this.enseignantService.update(this.currentId, data).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    } else {
      this.enseignantService.create(data).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    }
  }

  edit(enseignant: Enseignant): void {
    this.editMode = true;
    this.currentId = enseignant.id;
    this.selectedPhoto = enseignant.photo || null;
    this.enseignantForm.patchValue({ ...enseignant });
  }

  delete(id: number): void {
    if (confirm('Supprimer cet enseignant ?')) {
      this.enseignantService.delete(id).subscribe(() => this.loadEnseignants());
    }
  }

  resetForm(): void {
    this.enseignantForm.reset();
    this.editMode = false;
    this.currentId = undefined;
    this.selectedPhoto = null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.selectedPhoto = reader.result;
      reader.readAsDataURL(file);
    }
  }
}
