import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatiereService } from '../../service/matiere.service';
import { Matiere } from '../../model/matiere.model';
import { Enseigner } from '../../model/enseigner.model';
import { EnseignerService } from '../../service/enseigner.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-matieresenseignees',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './matieresenseignees.component.html',
  styleUrl: './matieresenseignees.component.scss'
})
export class MatieresenseigneesComponent implements OnInit {
  enseigner: Enseigner[] = [];
  ecole: any;
  search: any;
  currentPage: number = 1;

  constructor(private enseignerService: EnseignerService) {}

  ngOnInit(): void {
    this.getAllEnseigner();
      const user = localStorage.getItem('user');
      this.ecole = user ? JSON.parse(user).ecole : null;
  }

  getAllEnseigner(): void {
    this.enseignerService.getAllEnseigner(this.search).subscribe((data) => {
      this.enseigner = data;
    });

  }



  modifierMatiere(id: number): void {
    // Rediriger vers la page de modification
    console.log(`Modifier la matière ID: ${id}`);
  }

  supprimerMatiere(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matière ?')) {

    }
  }
}
