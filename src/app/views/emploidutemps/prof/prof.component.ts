import { EmploidutempService } from './../../../service/emploidutemp.service';
import { AnneeuvService } from './../../../service/anneeuv.service';
import { EnseignantService } from './../../../service/enseignant.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Anneeuv } from './../../../model/anneeuv.model';
import { Enseignant } from './../../../model/enseignant.model';
import { Emploidutemp } from './../../../model/emploidutemp.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-prof',
  standalone: true,
  imports: [
    CommonModule, // ✅ Ajouter ici
    ReactiveFormsModule, // ✅ Assurer que le form fonctionne
    RouterModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  templateUrl: './prof.component.html',
  styleUrl: './prof.component.scss'
})
export class ProfComponent implements OnInit {
  emargementForm!: FormGroup;
  listeProf: Enseignant[] = [];
  annees: Anneeuv[] = [];
  emploisDuTemps: Emploidutemp[] = [];
  loading: boolean = false;

  ecoleId!: number; // ID de l'école (à récupérer dynamiquement si nécessaire)


  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempService,
    private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.emargementForm = this.fb.group({
      enseignant: [''],
      jour: [''],
      annee: ['']
    });

    this.getAllEnseignantsByEcole();
    this.loadAnnees();

  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    /*if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.listeProf = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }*/
  }

  loadAnnees() {
    this.anneeService.getAllAnnee().subscribe((data) => {
      this.annees = data;
    });
  }

  afficherEmploiProf() {
    this.loading = true;
    const formData = this.emargementForm.value;
    /*this.emploiService.getEmploiByProf(formData.enseignant).subscribe((data) => {
      this.emploisDuTemps = data;
      this.loading = false;
    });*/
  }
}
