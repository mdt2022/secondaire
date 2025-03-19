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
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-classeemploi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink

  ],
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
    user!: User;

  constructor(
    private emploiService: EmploidutempService,
    private classeService: ClasseService,
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
      this.emploiService.getAllemploidutemps().subscribe((data: Emploidutemp[]) => {
        this.emploiDuTemps = data;

      });
    }
  }

}
