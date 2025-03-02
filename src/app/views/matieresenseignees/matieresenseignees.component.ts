import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matieresenseignees',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './matieresenseignees.component.html',
  styleUrl: './matieresenseignees.component.scss'
})
export class MatieresenseigneesComponent implements OnInit {
  matieres: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getMatieres();
  }

  getMatieres(): void {
     
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