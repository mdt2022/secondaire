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
  searchTerm = '';

  editMode = false;
  currentId?: number;
  user!: User;

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

  loadDonnees(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;

    this.enseignantService.getEnseignantEcole(idEcole)
      .subscribe(d => this.enseignants = d);

    this.enseignerService.getAllForEcole(idEcole)
      .subscribe(d => this.enseignes = d);

    this.classeService.getAllClasseParEcole(idEcole)
      .subscribe(d => this.classes = d);

    this.anneeuvService.getAll()
      .subscribe(d => this.anneeuvs = d);
  }

  loadEmplois(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;

    this.emploiService.getAll().subscribe(data => {
      this.emplois = data
        .filter(e => e.ecole?.idEcole === idEcole)
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0)); // dernier en haut

      this.applyFilter();
    });
  }

  applyFilter(): void {
    const term = (this.searchTerm || '').toLowerCase();

    this.filteredEmplois = this.emplois.filter(e =>
      (e.matiere?.libelle || '').toLowerCase().includes(term) ||
      (e.classe?.nom || '').toLowerCase().includes(term) ||
      (e.enseignant?.nom || '').toLowerCase().includes(term)
    );

    this.page = 1;
    this.updatePage();
  }


  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEmplois = this.filteredEmplois.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.filteredEmplois.length) {
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
    if (this.emploiForm.invalid) return;

    const payload: Partial<Emploidutemps> = {
      ...this.emploiForm.value,
      matiere: { id: this.emploiForm.value.matiere } as any,
      enseignant: { id: this.emploiForm.value.enseignant } as any,
      classe: { id: this.emploiForm.value.classe } as any,
      anneeuv: { id: this.emploiForm.value.anneeuv } as any,
      ecole: { idEcole: this.user.administrateur.ecole.idEcole } as any
    };

    const req = this.editMode && this.currentId
      ? this.emploiService.update(this.currentId, payload as Emploidutemps)
      : this.emploiService.create(payload as Emploidutemps);

    req.subscribe(() => {
      this.loadEmplois();
      this.resetForm();
    });
  }

  edit(e: Emploidutemps): void {
    this.editMode = true;
    this.currentId = e.id;

    this.emploiForm.patchValue({
      jour: e.jour,
      heuredebut: e.heuredebut,
      heurefin: e.heurefin,
      matiere: e.matiere?.id,
      enseignant: e.enseignant?.id,
      classe: e.classe?.id,
      anneeuv: e.anneeuv?.id
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet emploi du temps ?')) return;
    this.emploiService.delete(id).subscribe(() => this.loadEmplois());
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

}
