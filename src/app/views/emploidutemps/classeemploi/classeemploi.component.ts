import { MatiereService } from '../../../service/matiere.service';
import { Component, OnInit } from '@angular/core';
import { ClasseService } from '../../../service/classe.service';
import { Classe } from '../../../model/classe.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Emploidutemp } from '../../../model/emploidutemp.model';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { Matiere } from '../../../model/matiere.model';

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
  emploi: any;

  constructor(
    private emploiService: EmploidutempService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private matiereService: MatiereService
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


  getAllMatieres(): string {
    let matieres: Matiere[] = [];
    this.matiereService.getAllMatieres().subscribe((data: Matiere[]) => {
      matieres = data;
    });
    return matieres.length > 0 ? matieres[0].libelle : '';
  }

}
