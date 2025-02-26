import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './matieres.component.html',
  styleUrl: './matieres.component.scss'
})
export class MatieresComponent implements OnInit {
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