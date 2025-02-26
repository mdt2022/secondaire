import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-matierecreation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './matierecreation.component.html',
  styleUrl: './matierecreation.component.scss'
})
export class MatierecreationComponent implements OnInit {
  matiereForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.matiereForm = this.fb.group({
      libelle: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0)]],
      horaire: ['', [Validators.required, Validators.min(0)]],
      etat: ['1', Validators.required]
    });
  }

  onSubmit() {
    if (this.matiereForm.valid) {
      console.log("Formulaire soumis avec succès", this.matiereForm.value);
      // Ajouter l'appel à l'API pour sauvegarder la matière ici
    }
  }

 
}

