// import { MatiereService } from 'src/app/services/matiere.service';
import { Component, OnInit } from '@angular/core';
import { ClasseService } from 'src/app/service/classe.service';
import { Classe } from 'src/app/model/classe.model';
import { Anneeuv } from 'src/app/model/anneeuv.model';
import { Emploidutemp } from 'src/app/model/emploidutemp.model';
import { EmploidutempService } from 'src/app/service/emploidutemp.service';
import { AnneeuvService } from 'src/app/service/anneeuv.service';

@Component({
  selector: 'app-classe',
  templateUrl: './classeemploi.component.html',
  styleUrls: ['./classeemploi.component.scss']
})
export class ClasseemploiComponent implements OnInit {
  classes: Classe[] = [];
  annees: Anneeuv[] = [];
  emploiDuTemps: Emploidutemp[] = [];
  selectedClasse: string = '';
  selectedAnnee: string = '';

  constructor(
    private emploiService: EmploidutempService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    // private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadAnnees();
  }

  loadClasses(): void {
    this.classeService.getAllClasse().subscribe((data: Classe[]) => {
      this.classes = data;
    });
  }

  loadAnnees(): void {
    this.anneeService.getAllAnnee().subscribe((data: Anneeuv[]) => {
      this.annees = data;
    });
  }

  afficherEmploi(): void {
    if (this.selectedClasse && this.selectedAnnee) {
      this.emploiService.getAllemploidutemps().subscribe((data: Emploidutemp[]) => {
        this.emploiDuTemps = data;
      });
    }
  }

  // getMatiere(matiereId: string): string {
  //   let matiere = this.matiereService.getMatiereById(matiereId);
  //   return matiere ? matiere.libelle : '';
  // }
}
