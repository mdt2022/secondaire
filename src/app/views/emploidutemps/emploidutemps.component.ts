import { RouterModule } from '@angular/router';
import { Emploidutemp } from './../../model/emploidutemp.model';
import { EmploidutempService } from './../../service/emploidutemp.service';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-emploidutemps',
  standalone:true,
  imports :[
    NgxPaginationModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './emploidutemps.component.html',
  styleUrls: ['./emploidutemps.component.scss']
})
export class EmploidutempsComponent implements OnInit {
  // Ajoutez cette propriété
  Math = Math;
  emploisDuTemps: Emploidutemp[] = [];
  searchText: string = '';
  currentPage: number = 1;
  ecole: any;
  user!: User;
  sortColumn: string = '';
  sortDirection: boolean = true;
  itemsPerPage: number = 10;
  constructor(
    private emploiDuTempsService: EmploidutempService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getEmploisDuTemps()

  }

  getEmploisDuTemps(): void {
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;
    const anneeuvId = this.user.parametre.anneepardefaut.id;

    this.emploiDuTempsService.getByAnneeEcole(anneeuvId, 10).subscribe({
      next: (data) => {
        this.emploisDuTemps = data;
        console.log('Emplois du temps:', this.emploisDuTemps);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des emplois du temps', error);
      }
    });
  }

  filteredEmploisDuTemps() {
    console.log(this.emploisDuTemps);
    return this.emploisDuTemps.filter(emploi =>
    (emploi.professeur && emploi.professeur.nom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (emploi.professeur && emploi.professeur.prenom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (emploi.classe && emploi.classe.nom.toLowerCase().includes(this.searchText.toLowerCase()))
  );
  }

  deleteEmploi(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      console.log('Suppression de l\'emploi du temps avec ID:', id);
    }
  }
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
      this.sortColumn = column;
    }
    this.emploisDuTemps.sort((a: any, b: any) => {
      const aVal = this.resolvePath(a, column);
      const bVal = this.resolvePath(b, column);

      if (aVal < bVal) return this.sortDirection ? -1 : 1;
      if (aVal > bVal) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  resolvePath(object: any, path: string) {
    return path.split('.').reduce((o, p) => o && o[p], object);
  }
}
