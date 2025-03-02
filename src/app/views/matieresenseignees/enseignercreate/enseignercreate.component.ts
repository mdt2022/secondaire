import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-enseignercreate',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './enseignercreate.component.html',
  styleUrl: './enseignercreate.component.scss'
})
export class EnseignercreateComponent implements OnInit {
  enseignerForm: FormGroup | undefined;
  enseignants = [
    { id: 1, prenom: 'Jean', nom: 'Dupont' },
    { id: 2, prenom: 'Marie', nom: 'Lemoine' },
    // Ajouter d'autres enseignants ici
  ];
  etablissement = 'Nom de l\'établissement';  // Remplacez par la valeur de l'établissement
  retourAffectation: string = '';
  idetablissement = '123';  // Remplacez par l'ID de l'établissement
  
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.enseignerForm = this.fb.group({
      professeur: ['', Validators.required],
      nombreclasse: ['', [Validators.required, Validators.min(1)]],
      ecole: [this.idetablissement]
    });
  }

  onSubmit(): void {
    
  }

  affecter(): void {
    

  }
}
