import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Matiere } from '../../model/matiere.model';
import { HttpClientModule } from '@angular/common/http';
import { MatiereService } from '../../service/matiere.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.scss']
})
export class MatieresComponent implements OnInit {
  matieres: Matiere[] = [];
  ecole: any;
  currentPage: number = 1;

  constructor(private  matiereService: MatiereService) {}

  ngOnInit(): void {
    this.getAllMatieres();
  }

  getAllMatieres(): void {
    this.matiereService.getAllMatieres().subscribe({
      next: (data) => {
        this.matieres = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des matières', error);
      }
    });
  }

  modifierMatiere(id: number): void {
    console.log(`Modifier la matière ID: ${id}`);
  }

  supprimerMatiere(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matière ?')) {

    }
  }
}
