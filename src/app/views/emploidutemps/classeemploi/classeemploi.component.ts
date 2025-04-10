import { MatiereService } from '../../../service/matiere.service';
import { Component, OnInit } from '@angular/core';
import { ClasseService } from '../../../service/classe.service';
import { Classe } from '../../../model/classe.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Emploidutemp } from '../../../model/emploidutemp.model';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { Matiere } from '../../../model/matiere.model';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClasseEcoleService } from '../../../service/classeecole.service';

@Component({
  selector: 'app-classeemploi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './classeemploi.component.html',
  styleUrls: ['./classeemploi.component.scss']
})
export class ClasseemploiComponent implements OnInit {
  classes: Classe[] = [];
  annees: Anneeuv[] = [];
  emploiDuTemps: Emploidutemp[] = [];
  selectedClasse!: Classe;
  selectedAnnee: string = '';
  emploi: any;
    user!: User;

  constructor(
    private emploiService: EmploidutempService,
    private classeEcoleService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private matiereService: MatiereService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getClasseEcole();
    this.loadAnnees();
    this.getAllMatieres()

  }

  getClasseEcole() {
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;

    if (ecoleId) {
      this.classeEcoleService.getClassesByEcole(ecoleId).subscribe({
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


  loadAnnees(): void {
    this.anneeService.getAllAnnee().subscribe((data: Anneeuv[]) => {
      this.annees = data;
    });
  }

  getAllMatieres(): string {
    let matieres: Matiere[] = [];
    this.matiereService.getAllMatieres().subscribe((data: Matiere[]) => {
      matieres = data;
    });
    return matieres.length > 0 ? matieres[0].libelle : '';
  }
  afficherEmploi(): void {
    if (this.selectedClasse && this.selectedAnnee) {
      const ecoleId = this.user.administrateur.ecole.idEcole;

      this.emploiService.getByClasseAnneeEcole(+this.selectedClasse, +this.selectedAnnee, ecoleId).subscribe((data: Emploidutemp[]) => {
        this.emploiDuTemps = data;
        console.log('Emploi du temps récupéré :', this.emploiDuTemps);
      }, (error) => {
        console.error('Erreur lors du chargement des emplois du temps', error);
      });
    }
  }
  getUniqueHoraires(): { debut: string, fin: string }[] {
    const horaires = this.emploiDuTemps.map(e => ({ debut: e.heuredebut, fin: e.heurefin }));
    const uniqueHoraires = horaires.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.debut === value.debut && t.fin === value.fin
      ))
    );
    return uniqueHoraires;
  }
  getMatiereForDay(horaire: { debut: string, fin: string }, jour: string): string {
    const emploi = this.emploiDuTemps.find(e =>
      e.heuredebut === horaire.debut &&
      e.heurefin === horaire.fin &&
      e.jour === jour
    );
    return emploi ? emploi.matiere.libelle : '';
  }

}
