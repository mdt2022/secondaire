import { AnneeuvService } from '../../../service/anneeuv.service';
import { Component, OnInit } from '@angular/core';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../model/user.model';
import { AuthService } from '../../../service/auth.service';
import { Emploidutemp } from '../../../model/emploidutemp.model';
import { Classe } from '../../../model/classe.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Djournalier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink



  ],
  templateUrl: './Djournalier.component.html',
  styleUrls: ['./Djournalier.component.scss']
})
export class DjournalierComponent implements OnInit {
  annees: any[] = [];
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  selectedAnnee: string = '';
  selectedJour: string = '';
  emploiDuTemps: any[] = [];
  loading: boolean = false;
  user!: User;
  classes: Classe[] = [];
  emplois: Emploidutemp[] = [];
 jour!: string ;
    annee!: number ;
    idEcole!: number ;
    ecoleId!: number;
  todayDate: string = new Date().toLocaleDateString();
  constructor(
    private anneeuvService: AnneeuvService,
    private emploiService: EmploidutempService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.todayDate = new Date().toLocaleDateString();
    this.loadAnnees();
  }

  loadAnnees(): void {
    this.anneeuvService.getAllAnnee().subscribe({
      next: (data) => {
        this.annees = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des années', error);
      }
    });
  }

  afficherEmploi(): void {
    if (!this.selectedAnnee || !this.selectedJour) {
      console.error('Veuillez sélectionner à la fois une année et un jour.');
      return;
    }

    this.jour = this.selectedJour;
    this.annee = +this.selectedAnnee;

    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;
    const anneeuvId = this.user.parametre.anneepardefaut.id;

    this.loading = true;
    this.emploiService.getByJourAnneeEcole(this.selectedJour, anneeuvId, ecoleId).subscribe({
      next: (data) => {
        this.emplois = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur lors du chargement des emplois du temps', error);
      }
    });
  }

  generatePrintUrl(): string {
    return `/emploidutemps/imprimerjournalier/${this.jour}/${this.annee}`;
  }
}
