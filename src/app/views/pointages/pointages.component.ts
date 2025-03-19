import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ecole } from '../../model/ecole.model';
import { Enseignant } from '../../model/enseignant.model';
import { EnseignantService } from '../../service/enseignant.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ClasseService } from '../../service/classe.service';
import { Classe } from '../../model/classe.model';
import { User } from '../../model/user.model';
import { CommonModule } from '@angular/common';
import { EcoleService } from '../../service/ecole.service';

@Component({
  selector: 'app-pointages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pointages.component.html',
  styleUrl: './pointages.component.scss'
})
export class PointagesComponent implements OnInit {
  pointageForm: FormGroup;
  ecoles: Ecole[] = [];
  enseignants: Enseignant[] = []; 
  classes: Classe[] = [];
  user!: User;

  constructor(private fb: FormBuilder,
        private enseignantService: EnseignantService,
        private anneeService: AnneeuvService,
        private authService: AuthService,
        private ecoleService: EcoleService,
        private router: Router
  ) {
    // Créez le formulaire réactif
    this.pointageForm = this.fb.group({
      ecole: ['', Validators.required],
      enseignant: ['', Validators.required],
      dateDebut: [new Date().toISOString().slice(0, 10), Validators.required],
      dateFin: [new Date().toISOString().slice(0, 10), Validators.required]
    });

  }

  ngOnInit(): void {
    this.getAllEcole();
    this.getAllEnseignantsByEcole();
  }

  getAllEcole() {
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;

    if (ecoleId) {
      this.ecoleService.getAllEcole().subscribe({
        next: (data) => {
          this.ecoles = data;
          console.log(data);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes', error);
        }
      });
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.enseignants = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  onSubmit() {
    if (this.pointageForm.valid) {
      console.log(this.pointageForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }
}
