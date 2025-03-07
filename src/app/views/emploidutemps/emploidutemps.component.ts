import { RouterModule } from '@angular/router';
import { Emploidutemp } from './../../model/emploidutemp.model';
import { EmploidutempService } from './../../service/emploidutemp.service';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-emploidutemps',
  standalone:true,
  imports :[
    NgxPaginationModule,
    RouterModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './emploidutemps.component.html',
  styleUrls: ['./emploidutemps.component.scss']
})
export class EmploidutempsComponent implements OnInit {
  emploisDuTemps: Emploidutemp[] = [];  // Liste des emplois du temps
  searchText: string = '';
  currentPage: number = 1;
  ecole: any;

  constructor(private emploiDuTempsService: EmploidutempService) {}

  ngOnInit(): void {
    this.getEmploisDuTemps()

  }

  // Récupérer les emplois du temps du service
  getEmploisDuTemps(): void {
    this.emploiDuTempsService.getAllemploidutemps().subscribe({
      next: (data) => {
        this.emploisDuTemps = data;
        console.log('Emplois du temps:', this.emploisDuTemps);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des emplois du temps', error);
      }
    });
  }

  // Méthode de filtrage
  filteredEmploisDuTemps() {
    console.log(this.emploisDuTemps);
    return this.emploisDuTemps.filter(emploi =>
    (emploi.professeur && emploi.professeur.nom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (emploi.classe && emploi.classe.nom.toLowerCase().includes(this.searchText.toLowerCase()))
  );
  }

  // Méthode pour supprimer un emploi du temps
  deleteEmploi(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      // Implémentation de la suppression ici
      console.log('Suppression de l\'emploi du temps avec ID:', id);
    }
  }
}
