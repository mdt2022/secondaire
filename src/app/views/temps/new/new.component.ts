import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { EnseignerService } from '../../../service/enseigner.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AuthService } from '../../../service/auth.service';

import { Emploidutemps } from '../../../model/emploidutemps';
import { Enseigner } from '../../../model/enseigner';
import { Enseignant } from '../../../model/enseignant';
import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { User } from '../../../model/user';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit {

  emploiForm!: FormGroup;
  emplois: Emploidutemps[] = [];
  filteredEmplois: Emploidutemps[] = [];
  pagedEmplois: Emploidutemps[] = [];

  enseignes: Enseigner[] = [];
  enseignants: Enseignant[] = [];
  classes: Classe[] = [];
  anneeuvs: Anneeuv[] = [];

  page = 1;
  pageSize = 10;
  totalPages = 1;
  searchTerm = '';

  editMode = false;
  currentId?: number;
  user!: User;

  selectedEmploi?: Emploidutemps;

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private enseignerService: EnseignerService,
    private enseignantService: EnseignantService,
    private classeService: ClasseEcoleService,
    private anneeuvService: AnneeuvService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();

    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required],
      matiere: ['', Validators.required],
      enseignant: ['', Validators.required],
      classe: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadDonnees();
    this.loadEmplois();
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) return;

    const f = this.emploiForm.value;

    const payload = {
      jour: f.jour,
      heuredebut: f.heuredebut,
      heurefin: f.heurefin,
      matiere: { id: Number(f.matiere) },
      professeur: { id: Number(f.enseignant) },
      classe: { id: Number(f.classe) },
      anneeuv: { id: Number(f.anneeuv) },
      ecole: { idEcole: this.user.administrateur.ecole.idEcole }
    } as Emploidutemps;

    const request = this.editMode && this.currentId
      ? this.emploiService.update(this.currentId, payload)
      : this.emploiService.create(payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadEmplois(); 
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }

  loadDonnees(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;

    this.enseignantService.getEnseignantEcole(idEcole)
      .subscribe(data => this.enseignants = data);

    this.enseignerService.getAllForEcole(idEcole)
      .subscribe(data => this.enseignes = data);

    this.classeService.getAllClasseParEcole(idEcole)
      .subscribe(data => this.classes = data);

    this.anneeuvService.getAll()
      .subscribe(data => this.anneeuvs = data);
  }

  loadEmplois(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;

    this.emploiService.getAll().subscribe({
      next: (data) => {
        this.emplois = data
          .filter(e => e.ecole?.idEcole === idEcole)
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

        this.applyFilter();
      },
      error: (err) => console.error('Erreur chargement :', err)
    });
  }

  applyFilter(): void {
    const term = (this.searchTerm || '').toLowerCase();

    this.filteredEmplois = this.emplois.filter(e =>
      (e.matiere?.libelle || '').toLowerCase().includes(term) ||
      (e.classe?.nom || '').toLowerCase().includes(term) ||
      (e.professeur?.nom || '').toLowerCase().includes(term) ||
      (e.professeur?.prenom || '').toLowerCase().includes(term)
    );

    this.page = 1;
    this.totalPages = Math.ceil(this.filteredEmplois.length / this.pageSize);
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEmplois = this.filteredEmplois.slice(start, start + this.pageSize);
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

  edit(e: Emploidutemps): void {
    this.editMode = true;
    this.currentId = e.id;

    this.emploiForm.patchValue({
      jour: e.jour,
      heuredebut: e.heuredebut,
      heurefin: e.heurefin,
      matiere: e.matiere?.id,
      enseignant: e.professeur?.id,
      classe: e.classe?.id,
      anneeuv: e.anneeuv?.id
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet emploi du temps ?')) return;

    this.emploiService.delete(id).subscribe({
      next: () => this.loadEmplois(),
      error: (err) => console.error('Erreur suppression :', err)
    });
  }

  resetForm(): void {
    this.emploiForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value || '';
    this.applyFilter();
  }

  showDetails(e: Emploidutemps): void {
    this.selectedEmploi = e;
  }

  backToList(): void {
    this.selectedEmploi = undefined;
  }
}
