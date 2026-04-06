import { Component, OnInit } from '@angular/core';
import { EcoleService } from './../../service/ecole.service';
import { EnseignantService } from './../../service/enseignant.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ecole } from '../../model/ecole';
import { Enseignant } from '../../model/enseignant';
import Swal from 'sweetalert2';

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
    this.ecoleService.getAll().subscribe({
      next: (data) => {
        this.ecoles = data;

        const user = JSON.parse(localStorage.getItem('user')!);
        const adminEcoleId = user.administrateur.ecole.idEcole;

        const adminEcoleExists = this.ecoles.find(e => e.idEcole === adminEcoleId);
        if (adminEcoleExists) {
          this.selectedEcoleId = adminEcoleId;
          this.onEcoleChange(); 
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les écoles',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onEcoleChange(): void {
    if (this.selectedEcoleId) {
      this.enseignantService.getEnseignantEcole(this.selectedEcoleId).subscribe({
        next: (data) => {
          this.enseignants = data;

          if (this.enseignants.length > 0) {
            this.selectedEnseignantId = this.enseignants[0].id;
          } else {
            this.selectedEnseignantId = undefined;
            Swal.fire({
              icon: 'info',
              title: 'Aucun enseignant',
              text: 'Aucun enseignant n’est disponible pour cette école.',
              confirmButtonText: 'OK'
            });
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger les enseignants',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      this.enseignants = [];
      this.selectedEnseignantId = undefined;
    }
  }

  simuler(): void {
    if (!this.selectedEnseignantId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection obligatoire',
        text: 'Veuillez sélectionner un enseignant',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.validateDates()) return;

    this.router.navigate(['/pointage/fiche-validee'], {
      queryParams: {
        ecoleId: this.selectedEcoleId,
        enseignantId: this.selectedEnseignantId,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin
      }
    });
  }

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
      Swal.fire({
        icon: 'warning',
        title: 'Dates invalides',
        text: 'Veuillez entrer des dates valides au format JJ/MM/AAAA',
        confirmButtonText: 'OK'
      });
      return false;
    }

    return true;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
