import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-enregistrer-frai',
  standalone: true,
  imports:[
    RouterModule,
    CommonModule
  ],
  templateUrl: './enregistrer-frai.component.html',
  styleUrl: './enregistrer-frai.component.scss'
})
export class EnregistrerFraiComponent implements OnInit {
  fraisForm: FormGroup;
  classes: any[] = [];
  annees: any[] = [];
  eleves: any[] = [];
  ecole: number = 1; // Remplacez par la valeur réelle de l'école
  utilisateur: number = 1; // Remplacez par l'utilisateur connecté

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.fraisForm = this.fb.group({
      annee: ['', Validators.required],
      classe: ['', Validators.required],
      eleve: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      reduction: [0, [Validators.min(0)]],
      ecole: [this.ecole],
      datedajout: [new Date().toLocaleDateString()],
      utilisateur: [this.utilisateur]
    });
  }

  ngOnInit() {
  }

  

    

  onClasseChange() {
    const classeId = this.fraisForm.get('classe')?.value;
    const anneeId = this.fraisForm.get('annee')?.value;

   
  }

  onSubmit() {
    if (this.fraisForm.valid) {
      console.log('Données soumises:', this.fraisForm.value);
      // Envoyer les données au backend via le service
      
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

