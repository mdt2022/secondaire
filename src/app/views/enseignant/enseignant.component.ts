import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../model/enseignant';
import { EnseignantService } from '../../service/enseignant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, ButtonModule, TableModule, FormModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getAdminData();
    console.log('🟢 getAdminData() retourne :', user);

    if (!user?.administrateur?.ecole?.idEcole) {
      console.error('🔴 Impossible de récupérer l’ID de l’école de l’utilisateur connecté.');
      return;
    }

    this.currentEcoleId = user.administrateur.ecole.idEcole;
    console.log('🟢 ID école détecté :', this.currentEcoleId);

    this.initForm();
    this.loadEnseignants();
  }

  private initForm(): void {
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
    if (!this.currentEcoleId) return;

    console.log('🟢 Chargement des enseignants pour l’école id=', this.currentEcoleId);

    this.enseignantService.getEnseignantEcole(this.currentEcoleId).subscribe(
      data => {
        console.log('🟢 Enseignants reçus :', data);
        this.enseignants = data.sort((a, b) => b.id - a.id);
        this.applyFilter();
      },
      error => console.error('🔴 Erreur lors de la récupération des enseignants :', error)
    );
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value || '';
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEnseignants = this.enseignants.filter(e => {
      const nom = e.nom?.toLowerCase() || '';
      const prenom = e.prenom?.toLowerCase() || '';
      const matricule = e.matricule?.toLowerCase() || '';
      const telephone = e.telephone?.toLowerCase() || '';
      return nom.includes(term) || prenom.includes(term) || matricule.includes(term) || telephone.includes(term);
    });

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

  onSubmit(): void {
    if (this.enseignantForm.invalid) {
      console.warn('⚠️ Formulaire invalide, création/modification annulée');
      console.log(this.enseignantForm.value);
      return;
    }

    const data = { ...this.enseignantForm.value, photo: this.selectedPhoto, ecole: { idEcole: this.currentEcoleId } };
    console.log(this.editMode ? '✏️ Modification enseignant :' : '➕ Création enseignant :', data);

    if (this.editMode && this.currentId) {
      this.enseignantService.update(this.currentId, data).subscribe(
        res => {
          console.log('✅ Enseignant modifié avec succès :', res);
          this.loadEnseignants();
          this.resetForm();
        },
        err => console.error('❌ Erreur modification enseignant :', err)
      );
    } else {
      this.enseignantService.create(data).subscribe(
        res => {
          console.log('✅ Enseignant créé avec succès :', res);
          this.loadEnseignants();
          this.resetForm();
        },
        err => console.error('❌ Erreur création enseignant :', err)
      );
    }
  }

  edit(enseignant: Enseignant): void {
    console.log('✏️ Edition de l’enseignant :', enseignant);
    this.editMode = true;
    this.currentId = enseignant.id;
    this.selectedPhoto = enseignant.photo || null;
    this.enseignantForm.patchValue({ ...enseignant });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet enseignant ?')) return;

    console.log('🗑️ Suppression enseignant id=', id);
    this.enseignantService.delete(id).subscribe(
      () => {
        console.log('✅ Enseignant supprimé avec succès id=', id);
        this.loadEnseignants();
      },
      err => console.error('❌ Erreur suppression enseignant :', err)
    );
  }

  resetForm(): void {
    console.log('♻️ Réinitialisation du formulaire');
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
      console.log('🖼️ Photo sélectionnée');
    }
  }
}
