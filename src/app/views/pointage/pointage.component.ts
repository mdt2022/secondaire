import { Component, OnInit } from '@angular/core';
import { EcoleService } from './../../service/ecole.service';
import { EnseignantService } from './../../service/enseignant.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ecole } from '../../model/ecole';
import { Enseignant } from '../../model/enseignant';

@Component({
  selector: 'app-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss'
})
export class PointageComponent implements OnInit {
  ecoles: Ecole[] = [];
  enseignants: Enseignant[] = [];
  selectedEcoleId?: number;
  selectedEnseignantId?: number;
  dateDebut: string;
  dateFin: string;

  constructor(
    private ecoleService: EcoleService,
    private enseignantService: EnseignantService,
    private router: Router
  ) {
    const today = new Date();
    this.dateDebut = this.formatDate(today);
    this.dateFin = this.formatDate(today);
  }

  ngOnInit(): void {
    this.loadEcoles();
  }

  loadEcoles(): void {
    this.ecoleService.getAll().subscribe(data => {
      this.ecoles = data;
    });
  }

  onEcoleChange(): void {
    if (this.selectedEcoleId) {
      this.enseignantService.getEnseignantEcole(this.selectedEcoleId).subscribe(data => {
        this.enseignants = data;
      });
    } else {
      this.enseignants = [];
    }
  }

  simuler(): void {
    if (!this.selectedEnseignantId) {
      alert('Veuillez sélectionner un enseignant');
      return;
    }

    if (!this.validateDates()) {
      return;
    }

    // Naviguer vers la page Fiche Validée avec les paramètres de recherche
    this.router.navigate(['/pointage/fiche-validee'], {
      queryParams: {
        ecoleId: this.selectedEcoleId,
        enseignantId: this.selectedEnseignantId,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin
      }
    });
  }

  // Méthode pour naviguer vers la page de paiement (honoraires)
  goToPaiement(): void {
    this.router.navigate(['/pointage/honoraires'], {
      queryParams: {
        ecoleId: this.selectedEcoleId,
        enseignantId: this.selectedEnseignantId,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin
      }
    });
  }

  private validateDates(): boolean {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dateRegex.test(this.dateDebut) || !dateRegex.test(this.dateFin)) {
      alert('Veuillez entrer des dates valides au format JJ/MM/AAAA');
      return false;
    }

    return true;
  }

  // Méthodes utilitaires pour les dates
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
