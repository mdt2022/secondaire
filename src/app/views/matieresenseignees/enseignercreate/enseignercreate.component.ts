import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatiereService } from '../../../service/matiere.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { Matiere } from '../../../model/matiere.model';
import { Enseignant } from '../../../model/enseignant.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Classe } from '../../../model/classe.model';
import { Ecole } from '../../../model/ecole.model';

@Component({
  selector: 'app-enseignercreate',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './enseignercreate.component.html',
  styleUrls: ['./enseignercreate.component.scss']
})
export class EnseignercreateComponent implements OnInit {
  form!: FormGroup;
  enseignants: Enseignant[] = [];
  matiere: Matiere[] = [];
  classes: Classe[] = [];
  retourAffectation: string = '';
  ecole: any;
  ecoleId!: number;

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      enseignant: ['', Validators.required],
      nombreclasse: ['', [Validators.required, Validators.min(1)]],
      matieresClasses: this.fb.array([]), // FormArray pour les matières à affecter
      ecole: [''] // Champ caché pour l'école
    });

    this.getEnseignantsByEcole();
    this.getAllMatieres();

      const user = localStorage.getItem('user');
      this.ecole = user ? JSON.parse(user).ecole : null;
  }

  // Fonction pour récupérer les enseignants
  getEnseignantsByEcole(): void {
    this.enseignantService.getEnseignantsByEcole(this.ecoleId).subscribe((data) => {
      this.enseignants = data;
    });
  }

  // Fonction pour récupérer les matières
  getAllMatieres(): void {
    this.matiereService.getAllMatieres().subscribe((data) => {
      this.matiere = data;
    });
  }

  // Fonction pour récupérer le FormArray des matières et classes
  get matieresClasses(): FormArray {
    return this.form.get('matieresClasses') as FormArray;
  }

  // Fonction appelée lors du clic sur "Affecter"
  affecter(): void {
    const nombreClasse = this.form.get('nombreclasse')?.value;
    this.matieresClasses.clear(); // Réinitialise le FormArray
    for (let i = 0; i < nombreClasse; i++) {
      this.matieresClasses.push(this.fb.group({
        classe: ['', Validators.required],
        matiere1: ['', Validators.required],
        matiere2: ['', Validators.required],
        matiere3: ['', Validators.required],
        matiere4: ['', Validators.required],
        matiere5: ['', Validators.required],
        matiere6: ['', Validators.required]
      }));
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.form.valid) {
      // Traiter les données du formulaire
      console.log(this.form.value);
      this.retourAffectation = 'Matières affectées avec succès !';
    } else {
      this.retourAffectation = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
