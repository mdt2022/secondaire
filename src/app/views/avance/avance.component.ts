import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './avance.component.html',
  styleUrl: './avance.component.scss'
})
export class AvanceComponent implements OnInit {
  empreinteForm!: FormGroup;
  isFormVisible = false;

  professeurs = [
    { id: 1, nom: 'M. Dupont' },
    { id: 2, nom: 'Mme Martin' },
    { id: 3, nom: 'M. Durand' }
  ];

  mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  anneesScolaires = ['2023-2024', '2024-2025', '2025-2026'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.empreinteForm = this.fb.group({
      professeur: ['', Validators.required],
      mois: ['', Validators.required],
      anneeScolaire: ['', Validators.required]
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onSubmit() {
    if (this.empreinteForm.valid) {
      console.log('Formulaire soumis :', this.empreinteForm.value);
      this.empreinteForm.reset();
      this.isFormVisible = false; // Cacher le formulaire après soumission
    }
  }
}

