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
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-creationemploidutemps',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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
    private enseignantService: EnseignantService,
    private authService: AuthService
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
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.professeurs = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
    if (ecoleId) {
      this.classeService.getClasseEcole(ecoleId).subscribe({
        next: (data) => {
          this.classes = data;
          console.log("Classes après mise à jour :", this.classes);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes', error);
        }
      });
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }  }

  onSubmit() {
    if (this.emploiForm.valid) {
      console.log("Données envoyées :", this.emploiForm.value);
      alert("Emploi du temps enregistré !");
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  }
}

