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
  ) {}

  ngOnInit(): void {
    this.getAllEcole();
    this.getEnseignantsByEcole();
    this.getAllAnnee();
  }

  getAllEcole() {
    this.ecoleService.getAllEcole().subscribe(data => {
      this.ecole = data;
    });
  }

  getEnseignantsByEcole() {
    this.enseignantService.getEnseignantsByEcole(this.ecoleId).subscribe(data => {
      this.listeprof = data;
    });
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

    this.loading = true;
    this.emploiService.getEmploiByProf(this.selectedProf).subscribe(data => {
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
