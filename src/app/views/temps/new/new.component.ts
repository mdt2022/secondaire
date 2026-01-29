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
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {

  emploiForm!: FormGroup;
  emplois: Emploidutemps[] = [];

  enseignes: Enseigner[] = [];
  enseignants: Enseignant[] = [];
  classes: Classe[] = [];
  anneeuvs: Anneeuv[] = [];

  editMode = false;
  currentId?: number;
  user!: User;

  jours: string[] = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ];

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
      professeur: ['', Validators.required],
      classe: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadDonnees();
    this.loadEmplois();
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
    this.emploiService.getAll()
      .subscribe(data => this.emplois = data);
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) return;

    const payload: any = {
      jour: this.emploiForm.value.jour,
      heuredebut: this.emploiForm.value.heuredebut,
      heurefin: this.emploiForm.value.heurefin,
      matiere: { id: this.emploiForm.value.matiere },
      professeur: { id: this.emploiForm.value.professeur },
      classe: { id: this.emploiForm.value.classe },
      anneeuv: { id: this.emploiForm.value.anneeuv },
      ecole: { id: this.user.administrateur.ecole.idEcole }
    };


    if (this.editMode && this.currentId) {
      this.emploiService.update(this.currentId, payload).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
    } else {
      this.emploiService.create(payload).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
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
      professeur: e.professeur?.id,
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
}
