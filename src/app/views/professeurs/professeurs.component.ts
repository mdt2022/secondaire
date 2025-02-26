import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './professeurs.component.html',
  styleUrl: './professeurs.component.scss'
})
export class ProfesseursComponent implements OnInit {
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