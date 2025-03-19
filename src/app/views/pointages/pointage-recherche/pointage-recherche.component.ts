import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pointage } from '../../../model/pointage.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pointage-recherche',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './pointage-recherche.component.html',
  styleUrl: './pointage-recherche.component.scss'
})
export class PointageRechercheComponent implements OnInit {

  pointages: Pointage[] = []; // Contiendra les données
  montantTotal: number = 0;
  avance: number = 5000; // Exemple d'avance, à récupérer depuis API si besoin

  ngOnInit() {
    // Simulation des données récupérées depuis une API
    this.pointages = [];

    this.calculateMontantTotal();
  }

  calculateMontant(pointage: Pointage): number {
    return pointage.enseignant.tarif * pointage.emploidutemp.matiere.horaire;
  }

  calculateMontantTotal() {
    this.montantTotal = this.pointages.reduce((total, p) => total + this.calculateMontant(p), 0);
  }

  deletePointage(id: number) {
    // Implémenter la suppression (via service API)
    this.pointages = this.pointages.filter(p => p.id !== id);
    this.calculateMontantTotal();
  }
}
