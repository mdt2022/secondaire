import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Anneeuv } from 'src/app/model/anneeuv.model';
import { Classe } from 'src/app/model/classe.model';
import { Eleve } from 'src/app/model/eleve.model';
import { User } from 'src/app/model/user.model';
import { AnneeuvService } from 'src/app/service/anneeuv.service';
import { AuthService } from 'src/app/service/auth.service';
import { ClasseService } from 'src/app/service/classe.service';

@Component({
  selector: 'app-listeredouble',
  standalone: true,
  imports: [ CommonModule,
    RouterLink,
    ReactiveFormsModule],
  templateUrl: './listeredouble.component.html',
  styleUrls: ['./listeredouble.component.scss']
})
export class ListeredoubleComponent implements OnInit {
  redoublementForm: FormGroup;
  eleves: Eleve[] = [];
  
  classes: Classe[] = [];
  anneeScolaires : Anneeuv[] = [];
  selectedAnneeScolaire: string = '';
  selectedClasse: string = '';
  user!: User;

  constructor(private fb: FormBuilder,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private authService: AuthService) {
    this.redoublementForm = this.fb.group({
      reinscrire: this.fb.array([]), 
      anneeScolaire: new FormControl(''),
      classe: new FormControl('')
    });

    this.eleves.forEach((eleve, index) => {
      this.redoublementForm.addControl('redoubler' + index, new FormControl(false));
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
      this.classeService.getClasseEcole(ecoleId).subscribe({
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
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.eleves.forEach((eleve, index) => {
      this.redoublementForm.get('redoubler' + index)?.setValue(checked);
    });
  }
  admission() {
    if (!this.selectedAnneeScolaire || !this.selectedClasse) {
      alert("Veuillez sélectionner une année et une classe.");
      return;
    }
    console.log(`Admission des élèves en ${this.selectedClasse} pour l'année ${this.selectedAnneeScolaire}`);
  }
  onSubmit() {
    console.log('Form values:', this.redoublementForm.value);
  }
}
