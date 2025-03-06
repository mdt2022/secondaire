import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Matiere } from '../../../model/matiere.model';
import { Enseignant } from '../../../model/enseignant.model';
import { Classe } from '../../../model/classe.model';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import {EnseignantService} from '../../../service/enseignant.service';
import {ClasseService} from '../../../service/classe.service';
import { MatiereService } from '../../../service/matiere.service';


@Component({
  selector: 'app-creationemploidutemps',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './creationemploidutemps.component.html',
  styleUrl: './creationemploidutemps.component.scss'
})
export class CreationemploidutempsComponent implements OnInit {
  emploiForm!: FormGroup;

  annees: Anneeuv[] = [];
  matieres: Matiere[] = [];
  professeurs: Enseignant[] = [];
  classes: Classe[] = [];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  idEcole!: number; // Remplace par l'ID réel de l'école

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempService,
    private anneeuvService: AnneeuvService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      annee: ['', Validators.required],
      jour: ['', Validators.required],
      matiere: ['', Validators.required],
      professeur: ['', Validators.required],
      classe: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required]
    });

    // Charger les données depuis l'API
    this.loadData();
  }

  loadData() {
    this.anneeuvService.getAllAnnee().subscribe(data => this.annees = data);
    this.matiereService.getAllMatieres().subscribe(data => this.matieres = data);
    this.enseignantService.getEnseignantsByEcole(this.idEcole).subscribe(data => this.professeurs = data);
    this.classeService.getClasseEcole(this.idEcole).subscribe(data => this.classes = data);
  }

  onSubmit() {
    if (this.emploiForm.valid) {
      console.log("Données envoyées :", this.emploiForm.value);
      alert("Emploi du temps enregistré !");
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  }
}

