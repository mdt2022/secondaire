import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../model/enseignant';
import { EnseignantService } from '../../service/enseignant.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, ButtonModule, TableModule, FormModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

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
  totalPages = 1;

  currentEcoleId?: number;

  selectedEnseignant: Enseignant | null = null;
  viewMode: 'list' | 'form' | 'details' = 'list';

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getAdminData();

    if (!user?.administrateur?.ecole?.idEcole) {
      console.error('❌ École introuvable');
      return;
    }

    this.currentEcoleId = user.administrateur.ecole.idEcole;
    this.initForm();
    this.loadEnseignants();
  }

  initForm(): void {
    this.enseignantForm = this.fb.group({
      matricule: [''],
      nom: [''],
      prenom: [''],
      adresse: [''],
      telephone: [''],
      email: [''],
      lieun: [''],
      datedn: [''],
      photo: [''],
      tarif: [0]
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getEnseignantEcole(this.currentEcoleId!).subscribe(data => {
      this.enseignants = data.sort((a, b) => b.id - a.id);
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
      e.matricule.toLowerCase().includes(term)
    );

    this.page = 1;
    this.totalPages = Math.ceil(this.filteredEnseignants.length / this.pageSize) || 1;
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEnseignants = this.filteredEnseignants.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
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

  show(e: Enseignant): void {
    this.selectedEnseignant = e;
    this.viewMode = 'details';
  }

  backToList(): void {
    this.selectedEnseignant = null;
    this.viewMode = 'list';
  }

  addNew(): void {
    this.resetForm();
    this.viewMode = 'form';
  }

  edit(e: Enseignant): void {
    this.editMode = true;
    this.currentId = e.id;
    this.selectedPhoto = e.photo;
    this.enseignantForm.patchValue(e);
    this.viewMode = 'form';
  }

  onSubmit(): void {
    const formValue = this.enseignantForm.value;

    const data = {
      matricule: formValue.matricule || `ENS-${Date.now()}`,
      nom: formValue.nom || 'Non renseigné',
      prenom: formValue.prenom || 'Non renseigné',
      adresse: formValue.adresse || 'Non renseigné',
      telephone: formValue.telephone || 'Non renseigné',
      email: formValue.email || '',
      lieun: formValue.lieun || 'Non renseigné',
      datedn: formValue.datedn || null,
      tarif: Number(formValue.tarif) || 0,
      photo: this.selectedPhoto || formValue.photo || '',
      ecole: { idEcole: this.currentEcoleId! }
    };

    const action = this.editMode
      ? this.enseignantService.update(this.currentId!, data)
      : this.enseignantService.create(data);

    action.subscribe(() => {
      this.loadEnseignants();
      this.resetForm();
      this.viewMode = 'list';
    });
  }

  async delete(id: number): Promise<void> {
    const confirmation = await Swal.fire({
      title: 'Supprimer cet enseignant ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    });
    if (!confirmation.isConfirmed) return;

    this.enseignantService.delete(id).subscribe(() => this.loadEnseignants());
  }

  resetForm(): void {
    this.enseignantForm.reset();
    this.editMode = false;
    this.currentId = undefined;
    this.selectedPhoto = null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.selectedPhoto = reader.result;
    reader.readAsDataURL(file);
  }
}
