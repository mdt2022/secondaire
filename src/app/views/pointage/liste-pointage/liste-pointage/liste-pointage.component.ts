import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PointageService } from '../../../../service/pointage.service';
import { EcoleService } from '../../../../service/ecole.service';
import { EnseignantService } from '../../../../service/enseignant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pointage } from '../../../../model/pointage';
import { Enseignant } from '../../../../model/enseignant';
import { AuthService } from '../../../../service/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-liste-pointage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './liste-pointage.component.html',
  styleUrl: './liste-pointage.component.scss'
})

export class ListePointageComponent implements OnInit {
  pointages: Pointage[] = [];
  selectedIds: number[] = [];
  enseignants: Enseignant[] = [];
  private ecoleId: number | null = null;

  constructor(
    private pointageService: PointageService,
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ecoleId = this.authService.getEcoleId();
    if (!this.ecoleId) {
      Swal.fire('Établissement introuvable', 'Impossible d’identifier l’établissement de l’utilisateur.', 'error');
      return;
    }
    this.loadPointages();
    this.loadEnseignants();
  }

  loadPointages(): void {
    if (!this.ecoleId) return;
    this.pointageService.getByEcole(this.ecoleId).subscribe({
      next: data => this.pointages = data,
      error: error => {
        console.error('Erreur lors du chargement des pointages :', error);
        Swal.fire('Erreur', 'Impossible de charger les pointages de cet établissement.', 'error');
      }
    });
  }

  loadEnseignants(): void {
    if (!this.ecoleId) return;
    this.enseignantService.getEnseignantEcole(this.ecoleId).subscribe({
      next: data => this.enseignants = data,
      error: error => {
        console.error('Erreur lors du chargement des enseignants :', error);
        Swal.fire('Erreur', 'Impossible de charger les enseignants de cet établissement.', 'error');
      }
    });
  }

  toggleSelection(id: number): void {
    const index = this.selectedIds.indexOf(id);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(id);
    }
  }

  selectAll(): void {
    this.selectedIds = this.pointages.map(p => p.id);
  }

  deselectAll(): void {
    this.selectedIds = [];
  }

  async supprimerSelection(): Promise<void> {
    if (this.selectedIds.length === 0) {
      Swal.fire('Sélection requise', 'Veuillez sélectionner au moins un pointage.', 'warning');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer ${this.selectedIds.length} pointage(s) ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    });
    if (!confirmation.isConfirmed) return;

    this.pointageService.supprimerMultiple(this.selectedIds).subscribe(() => {
      Swal.fire('Succès', 'Pointages supprimés avec succès.', 'success');
      this.loadPointages();
      this.selectedIds = [];
    });
  }

  getEnseignantNom(enseignantId: number | undefined): string {
    if (!enseignantId) return '';
    
    const enseignant = this.enseignants.find(e => e.id === enseignantId);
    return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : '';
  }

  getEnseignant(enseignantId: number | undefined): any {
    if (!enseignantId) return null;
    return this.enseignants.find(e => e.id === enseignantId);
  }
}