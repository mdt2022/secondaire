import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Classe } from '../../../model/classe.model';
import { User } from '../../../model/user.model';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AuthService } from '../../../service/auth.service';
import { ClasseecoleService } from '../../../service/classeecole.service';

@Component({
  selector: 'app-redoubleeleve',
  standalone: true,
  imports: [ CommonModule,
    RouterLink,
    ReactiveFormsModule],
  templateUrl: './redoubleeleve.component.html',
  styleUrl: './redoubleeleve.component.scss'
})
export class RedoubleeleveComponent implements OnInit{

  studentForm: FormGroup;
  classes: Classe[] = [];
  anneesScolaires: Anneeuv[] = [];
  user!: User
  constructor(private fb: FormBuilder,
    private classeecoleService: ClasseecoleService,
    private anneeService: AnneeuvService,
    private authService: AuthService) {
    this.studentForm = this.fb.group({
      classe: ['', Validators.required],
      anneeuv: ['', Validators.required]
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
        this.anneesScolaires = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }

  rechercher(): void {
    if (this.studentForm.valid) {
      console.log('Formulaire soumis', this.studentForm.value);
      // Logique pour récupérer la liste des élèves
    }
  }
}
