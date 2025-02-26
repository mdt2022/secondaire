import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nouvelle-empreinte',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nouvelle-empreinte.component.html',
  styleUrl: './nouvelle-empreinte.component.scss'
})
export class NouvelleEmpreinteComponent implements OnInit {

  // Déclaration du formulaire
  empreinteForm!: FormGroup;
  dateEmpreinte: string = new Date().toISOString().split('T')[0];  // Date du jour par défaut

  // Liste des professeurs (exemple)
  professeurs = [
    { id: 1, nom: 'M. Dupont' },
    { id: 2, nom: 'Mme Martin' },
    { id: 3, nom: 'M. Durand' }
  ];

  // Liste des mois
  mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Liste des années (exemple)
  annees = ['2023', '2024', '2025', '2026'];

  // Liste des années scolaires
  anneesScolaires = ['2016-2017', '2017-2018', '2018-2019'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.empreinteForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      mois: ['', Validators.required],
      annee: ['', Validators.required],
      dateEmpreinte: [this.dateEmpreinte, Validators.required],  // Date par défaut
      professeur: ['', Validators.required],
      anneeScolaire: ['', Validators.required]
    });
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.empreinteForm.valid) {
      console.log('Formulaire soumis :', this.empreinteForm.value);
      this.empreinteForm.reset();
    }
  }
}
