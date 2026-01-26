import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { Emploidutemps } from '../../../model/emploidutemps';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { Enseigner } from '../../../model/enseigner';
import { EnseignerService } from '../../../service/enseigner.service';
import { Enseignant } from '../../../model/enseignant';
import { EnseignantService } from '../../../service/enseignant.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { AnneeuvService } from '../../../service/anneeuv.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, CardModule, ButtonModule, TableModule
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {

  emplois: Emploidutemps[] = [];
  emploiForm!: FormGroup;
  editMode = false;
  currentId?: number;
  user!: User
  jours: string[] = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi'
  ];
  enseignes: Enseigner[] = []
  enseignants: Enseignant[] = []
  classes: Classe[] = []
  anneeuvs: Anneeuv[] = []


  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private service: EnseignerService,
    private enseignantService: EnseignantService,
    private classeecoleservice: ClasseEcoleService,
    private anneeuvservice: AnneeuvService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.loadDonnees()
    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required],
      matiere: ['', Validators.required],
      professeur: ['', Validators.required],
      classe: ['', Validators.required],
      ecole: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });
  }
  loadDonnees() {
    const idecole = this.user.administrateur.ecole.idEcole
    this.enseignantService.getEnseignantEcole(idecole).subscribe(data => this.enseignants = data);
    this.service.getAllForEcole(idecole).subscribe(data => (this.enseignes = data));
    this.classeecoleservice.getAllClasseParEcole(idecole).subscribe(data => this.classes = data)
    this.anneeuvservice.getAll().subscribe(data => this.anneeuvs = data)
  }
  

  loadEmplois() {
    this.emploiService.getAll().subscribe((data) => {
      this.emplois = data;
    });
  }

  onSubmit() {
    const formValue = {
      ...this.emploiForm.value/*,
      matiere: { id: this.emploiForm.value.matiere },
      professeur: { id: this.emploiForm.value.professeur },
      classe: { id: this.emploiForm.value.classe },
      ecole: { id: this.emploiForm.value.ecole },
      anneeuv: { id: this.emploiForm.value.anneeuv }*/
    };

    if (this.editMode && this.currentId) {
      this.emploiService.update(this.currentId, formValue).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
    } else {
      this.emploiService.create(formValue).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
    }
  }

  edit(emploi: Emploidutemps) {
    this.editMode = true;
    this.currentId = emploi.id;
    this.emploiForm.patchValue({
      jour: emploi.jour,
      heuredebut: emploi.heuredebut,
      heurefin: emploi.heurefin,
      matiere: emploi.matiere,
      professeur: emploi.professeur,
      classe: emploi.classe,
      ecole: emploi.ecole,
      anneeuv: emploi.anneeuv
    });
  }

  delete(id: number) {
    if (confirm('Supprimer cet emploi du temps ?')) {
      this.emploiService.delete(id).subscribe(() => this.loadEmplois());
    }
  }

  resetForm() {
    this.emploiForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
