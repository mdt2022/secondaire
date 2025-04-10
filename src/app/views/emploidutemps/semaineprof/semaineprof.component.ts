import { Component, OnInit } from '@angular/core';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { Ecole } from '../../../model/ecole.model';
import { Enseignant } from '../../../model/enseignant.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Emploidutemp } from '../../../model/emploidutemp.model';
import { EnseignantService } from '../../../service/enseignant.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EcoleService } from '../../../service/ecole.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-semaineprof',
  standalone: true,
  imports: [ RouterModule,
      CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './semaineprof.component.html',
  styleUrl: './semaineprof.component.scss'
})
export class SemaineprofComponent implements OnInit {

  ecole: any;
  listeprof: Enseignant[] = [];
  annees: Anneeuv[] = [];
  emploiDuTemps: Emploidutemp[] = [];
  selectedProf: string = '';
  selectedAnnee: string = '';
  loading: boolean = false;
  ecoleId!: number;

  constructor(private emploiService: EmploidutempService,
                private enseignantService:EnseignantService,
                private anneeuvService: AnneeuvService,
                private ecoleService: EcoleService,
                private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllEcole();
    this.getAllEnseignantsByEcole();
    this.getAllAnnee();
  }

  getAllEcole() {
    this.ecoleService.getAllEcole().subscribe(data => {
      this.ecole = data;
    });
  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.listeprof = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  getAllAnnee() {
    this.anneeuvService.getAllAnnee().subscribe(data => {
      this.annees = data;
    });
  }

  getEmploiDuTemps() {
    if (!this.selectedProf || !this.selectedAnnee) {
      alert("Veuillez sélectionner un professeur et une année.");
      return;
    }

    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (!ecoleId) {
      console.error("Impossible de récupérer l'ID de l'école.");
      return;
    }

    this.loading = true;
    this.emploiService.getByProfesseurAnneeEcoleSemaine(
      +this.selectedProf,
      +this.selectedAnnee,
      ecoleId
    ).subscribe(data => {
      this.emploiDuTemps = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error("Erreur lors du chargement de l'emploi du temps", error);
    });
  }


  imprimerPage() {
    window.print();
  }
}
