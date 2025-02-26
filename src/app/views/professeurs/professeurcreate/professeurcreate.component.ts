import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-professeurcreate',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './professeurcreate.component.html',
  styleUrl: './professeurcreate.component.scss'
})
export class ProfesseurcreateComponent implements OnInit {

  professeurForm: FormGroup;
  enseignants: any[] = [];  // Exemple de données pour les enseignants
  classes: any[] = [];  // Exemple de données pour les classes
  matieres: any[] = [];  // Exemple de données pour les matières
  etablissement: string = 'Etablissement';  // Exemple d'établissement

  constructor(private fb: FormBuilder, private router: Router) {
    // Création du formulaire avec des contrôles nécessaires
    this.professeurForm = this.fb.group({
      matricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lieun: ['', Validators.required],
      datedn: ['', Validators.required],
      tarif: ['', Validators.required],
      photo: [null],
      ecole: [''],  // Vous pouvez remplir cette valeur dynamiquement
    });
  }

  ngOnInit(): void {
    // Récupération des enseignants, classes, matières et établissement depuis une API ou un service
    // Exemple:
    // this.enseignants = this.enseignantService.getAllEnseignants();
    // this.classes = this.classeService.getAllClasses();
    // this.matieres = this.matiereService.getAllMatieres();
  }

  onSubmit(): void {
    if (this.professeurForm.valid) {
      console.log('Form submitted:', this.professeurForm.value);
      // Appeler un service pour enregistrer les données
      // Exemple:
      // this.professeurService.createProfesseur(this.professeurForm.value);
      this.router.navigate(['/enseignants']);  // Rediriger vers la liste des enseignants
    }
  }

  affecter(): void {
    // Logic to handle the affecter action
    console.log('Affecter action triggered');
  }
}