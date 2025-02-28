import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importer CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnseignantService } from '../../service/enseignant.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { Enseignant } from '../../model/enseignant.model';
import { Anneeuv } from '../../model/anneeuv.model';

@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [
    CommonModule, // ✅ Ajouter ici
    ReactiveFormsModule, // ✅ Assurer que le form fonctionne
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './avance.component.html',
  styleUrl: './avance.component.scss'
})
export class AvanceComponent implements OnInit {
  empreinteForm!: FormGroup;
  isFormVisible = false;

  enseignants: Enseignant[] = [];
  anneesScolaires: Anneeuv[] = []; // ✅ Correction du nom de la variable pour correspondre au template

  mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  authService: any;

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit() {
    this.empreinteForm = this.fb.group({
      enseignant: ['', Validators.required],
      mois: ['', Validators.required],
      anneeScolaire: ['', Validators.required] // ✅ Correction du formControlName pour correspondre au template
    });

    this.getAllEnseignantsByEcole();
    this.getAllAnnee();
  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage(); // ✅ Récupérer l'utilisateur connecté
    const ecoleId = user?.ecole?.idEcole; // ✅ Extraire l'ID de l'école
  
    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.enseignants = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }
  

  getAllAnnee() {
    this.anneeService.getAllAnnee().subscribe(
      (data) => {
        this.anneesScolaires = data; // ✅ Correction pour correspondre au template
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onSubmit() {
    if (this.empreinteForm.valid) {
      console.log('Formulaire soumis :', this.empreinteForm.value);
      this.empreinteForm.reset();
      this.isFormVisible = false;
    }
  }
}
