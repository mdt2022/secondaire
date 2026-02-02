import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PointageService } from '../../../../service/pointage.service';
import { EcoleService } from '../../../../service/ecole.service';
import { EnseignantService } from '../../../../service/enseignant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pointage } from '../../../../model/pointage';
import { Enseignant } from '../../../../model/enseignant';
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

  constructor(
    private pointageService: PointageService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    this.loadPointages();
    this.loadEnseignants();
  }

  loadPointages(): void {
    this.pointageService.getAll().subscribe(data => {
      this.pointages = data;
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
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

  supprimerSelection(): void {
    if (this.selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un pointage');
      return;
    }

    if (confirm(`Voulez-vous vraiment supprimer ${this.selectedIds.length} pointage(s)?`)) {
      this.pointageService.supprimerMultiple(this.selectedIds).subscribe(() => {
        alert('Pointages supprimés avec succès');
        this.loadPointages();
        this.selectedIds = [];
      });
    }
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