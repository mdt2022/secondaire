import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Anneeuv } from '../../../../model/anneeuv.model';
import { Classe } from '../../../../model/classe.model';
import { Eleve } from '../../../../model/eleve.model';
import { User } from '../../../../model/user.model';
import { AnneeuvService } from '../../../../service/anneeuv.service';
import { AuthService } from '../../../../service/auth.service';
import { ClasseecoleService } from '../../../../service/classeecole.service';

@Component({
  selector: 'app-listepassage',
  standalone: true,
  imports: [ 
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './listepassage.component.html',
  styleUrls: ['./listepassage.component.scss']
})
export class ListepassageComponent implements OnInit {
  reinscriptionForm: FormGroup;
  eleves: Eleve[] = [];
  
  classes: Classe[] = [];
  anneeScolaires : Anneeuv[] = [];
  selectedAnneeScolaire: string = '';
  selectedClasse: string = '';
  user!: User;

  constructor(private fb: FormBuilder,
    private classeecoleService: ClasseecoleService,
    private anneeService: AnneeuvService,
    private authService: AuthService) {
    this.reinscriptionForm = this.fb.group({
      reinscrire: this.fb.array([]), 
      classe: [''],
      annee: ['']
    });
  }

  ngOnInit(): void {
    this.getClasseEcole();
    this.getAllAnnee()
  }
  

  getClasseEcole() {
    this.user = this.authService.getUserFromLocalStorage(); 
    const ecoleId = this.user.administrateur.ecole.idEcole; 

    if (ecoleId) {
      this.classeecoleService.getClasseEcole(ecoleId).subscribe({
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
    }
  }
  getAllAnnee() {
    this.anneeService.getAllAnnee().subscribe(
      (data) => {
        this.anneeScolaires = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }
  get reinscrireArray(): FormArray {
    return this.reinscriptionForm.get('reinscrire') as FormArray;
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.reinscrireArray.clear();
    if (checked) {
      this.eleves.forEach(eleve => this.reinscriptionForm.get('reinscrire')?.value.push(eleve.id));
    }
  }
  admission() {
    if (!this.selectedAnneeScolaire || !this.selectedClasse) {
      alert("Veuillez sélectionner une année et une classe.");
      return;
    }
    console.log(`Admission des élèves en ${this.selectedClasse} pour l'année ${this.selectedAnneeScolaire}`);
  }
  onSubmit() {
    console.log('Form values:', this.reinscriptionForm.value);
  }
}
