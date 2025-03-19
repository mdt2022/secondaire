import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Eleve } from 'src/app/model/eleve.model';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.scss'
})
export class RechercheComponent implements OnInit {
  eleves: Eleve[] = [];

  constructor() {}

  ngOnInit(): void {}

  imprimerListe(): void {
    console.log('Impression de la liste des élèves');
  }

  exporterExcel(): void {
    console.log('Exportation vers Excel');
  }

  voirDetail(id: number): void {
    console.log(`Afficher détails de l'élève ID: ${id}`);
  }

  modifierEleve(id: number): void {
    console.log(`Modifier élève ID: ${id}`);
  }

  supprimerEleve(id: number): void {
    console.log(`Supprimer élève ID: ${id}`);
  }
}

