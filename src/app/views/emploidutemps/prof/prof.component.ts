import { EmploidutempService } from './../../../service/emploidutemp.service';
import { AnneeuvService } from './../../../service/anneeuv.service';
import { EnseignantService } from './../../../service/enseignant.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anneeuv } from './../../../model/anneeuv.model';
import { Enseignant } from './../../../model/enseignant.model';
import { Emploidutemp } from './../../../model/emploidutemp.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-prof',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule
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
  emploisFiltres: Emploidutemp[] = [];
  ecoleId!: number;
  user!: User;
  selectedProf: any;
  selectedAnnee: any;
  today: string = '';


  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempService,
    private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
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

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe({
        next: (data) => {
          this.listeProf = data;
          console.log(data+" mdt ---+++")
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      });
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  loadAnnees() {
    this.anneeService.getAllAnnee().subscribe((data) => {
      this.annees = data;
    });
  }
  getEmploiDuTemps() {
    this.user = this.authService.getUserFromLocalStorage();

    const ecoleId = this.user.administrateur.ecole.idEcole;
    const anneeuvId = this.user.parametre.anneepardefaut.id;
    const professeurId = this.user.parametre.anneepardefaut.id;
    this.loading = true;
    this.emploiService.getByProfesseurAnneeEcole(professeurId, anneeuvId, ecoleId ).subscribe(data => {
      this.emploisDuTemps = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error("Erreur lors du chargement de l'emploi du temps", error);
    });
  }

  afficherEmploiProf() {
    const formData = this.emargementForm.value;
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (!formData.enseignant || !formData.jour || !formData.annee || !ecoleId) {
      console.error('Champs requis manquants');
      return;
    }

    this.loading = true;
    this.emploiService.getByProfesseurAnneeEcole(formData.enseignant, formData.annee, ecoleId).subscribe({
      next: (data) => {
        this.emploisDuTemps = data;

        this.emploisFiltres = this.emploisDuTemps.filter(emploi => emploi.jour === formData.jour);

        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'emploi du temps", error);
        this.loading = false;
      }
    });
  }


}
