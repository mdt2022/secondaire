import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnseignantService } from 'src/app/service/enseignant.service';
import { AnneeuvService } from 'src/app/service/anneeuv.service'; 
import { Enseignant } from 'src/app/model/enseignant.model'; 
import { Anneeuv } from 'src/app/model/anneeuv.model'; 

@Component({
  selector: 'app-nouvelle-empreinte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [EnseignantService, AnneeuvService], // ✅ Ajout des services
  templateUrl: './nouvelle-empreinte.component.html',
  styleUrl: './nouvelle-empreinte.component.scss'
})
export class NouvelleEmpreinteComponent implements OnInit {
  empreinteForm!: FormGroup;
  enseignants: Enseignant[] = [];
  anneesScolaires: Anneeuv[] = [];
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
      montant: ['', [Validators.required, Validators.min(0)]],
      enseignant: ['', Validators.required],
      mois: ['', Validators.required],
      anneeScolaire: ['', Validators.required],
      dateEmpreinte: [this.getCurrentDate(), Validators.required]
    });

    this.getAllEnseignantsByEcole();
    this.getAllAnnee();
  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserLocalForm(); // ✅ Récupérer l'utilisateur connecté
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
        this.anneesScolaires = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  onSubmit() {
    if (this.empreinteForm.valid) {
      console.log('Formulaire soumis :', this.empreinteForm.value);
      this.empreinteForm.reset();
    }
  }
}
