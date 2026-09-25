import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { FraiscolaireService } from '../../service/fraiscolaireService';
import { Fraiscolaire } from '../../model/fraiscolaire';
import { Anneeuv } from '../../model/anneeuv';
import { Eleveecole } from '../../model/eleveecole';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { EleveecoleService } from '../../service/eleveecole.service';
import { AuthService } from '../../service/auth.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { Classe } from '../../model/classe';

@Component({
  selector: 'app-frais',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './frais.component.html',
  styleUrls: ['./frais.component.scss']
})
export class FraisComponent implements OnInit {

  currentView: 'search' | 'create' | 'result' = 'search';

  fraisList: Fraiscolaire[] = [];
  eleves: Eleveecole[] = [];
  classes: Classe[] = [];
  annees: Anneeuv[] = [];

  selectedClasse: number | null = null;
  selectedAnnee: number | null = null;
  selectedEleve: number | null = null;
  montant: number | null = null;
  reduction: number = 0;

  editingFrais?: Fraiscolaire;

  constructor(
    private fraisService: FraiscolaireService,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private eleveService: EleveecoleService,
    private authService: AuthService
  ) {}



  ngOnInit(): void {
    this.loadAnnees();
    this.loadClasses();
  }



  getNomClasse(): string {
    const c = this.classes.find(x => x.id === this.selectedClasse);
    return c ? c.nom : '';
  }

  getNomAnnee(): string {
    const a = this.annees.find(x => x.id === this.selectedAnnee);
    return a ? a.nom : '';
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: () => this.showError('Erreur chargement des années')
    });
  }

  loadClasses(): void {
    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) return;

    this.classeService.getAllClasseParEcole(ecoleId).subscribe({
      next: data => this.classes = data,
      error: () => this.showError('Erreur chargement des classes')
    });
  }

  loadEleves(): void {

    if (!this.selectedClasse || !this.selectedAnnee) {
      this.eleves = [];
      this.selectedEleve = null;
      return;
    }

    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) return;

    const body = [
      String(this.selectedAnnee),
      String(ecoleId),
      String(this.selectedClasse)
    ];

    this.eleveService.getByClasseAndAnnee(body).subscribe({
      next: data => this.eleves = data,
      error: () => this.showError('Erreur chargement des élèves')
    });
  }


  searchFrais(): void {

    if (!this.selectedClasse || !this.selectedAnnee) {
      this.showWarning('Veuillez sélectionner année et classe');
      return;
    }

    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) return;

    this.fraisService.search(ecoleId, this.selectedClasse, this.selectedAnnee)
      .subscribe({
        next: data => {

          if (!data || data.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Aucun frais trouvé',
              text: 'Aucun frais scolaire pour cette sélection'
            });
            return;
          }

          this.fraisList = data;
          this.currentView = 'result';
        },
        error: () => this.showError('Erreur lors de la recherche')
      });
  }


  saveFrais(): void {

    if (!this.selectedEleve) {
      this.showWarning('Veuillez sélectionner un élève');
      return;
    }

    if (!this.montant || this.montant <= 0) {
      this.showWarning('Veuillez saisir un montant valide');
      return;
    }

    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) return;

    const body: Fraiscolaire = {
      id: this.editingFrais?.id ?? 0,
      ecole: { idEcole: ecoleId } as any,
      classe: { id: this.selectedClasse! } as any,
      eleve: { id: this.selectedEleve } as any,
      anneeuv: { id: this.selectedAnnee! } as any,
      montant: this.montant,
      reduction: this.reduction
    };

    const action$ = this.editingFrais
      ? this.fraisService.update(this.editingFrais.id!, body)
      : this.fraisService.create(body);

    action$.subscribe({
      next: () => {
        this.showSuccess(
          this.editingFrais
            ? 'Frais modifié avec succès'
            : 'Frais ajouté avec succès'
        );
        this.resetForm();
        this.searchFrais();
      },
      error: () => this.showError('Erreur lors de l\'enregistrement')
    });
  }

editFrais(f: Fraiscolaire): void {

  this.editingFrais = f;

  this.selectedClasse = f.classe?.id ?? null;
  this.selectedAnnee  = f.anneeuv?.id ?? null;
  this.selectedEleve  = f.eleve?.id ?? null;

  this.montant   = f.montant ?? null;
  this.reduction = f.reduction ?? 0;

  this.currentView = 'create';
  this.loadEleves();
}


  deleteFrais(f: Fraiscolaire): void {

    Swal.fire({
      title: 'Confirmer la suppression ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer'
    }).then(res => {

      if (!res.isConfirmed) return;

      this.fraisService.delete(f.id!).subscribe({
        next: () => {
          this.showSuccess('Frais supprimé');
          this.fraisList = this.fraisList.filter(x => x.id !== f.id);
          if (this.fraisList.length === 0) {
            this.currentView = 'search';
          }
        },
        error: () => this.showError('Erreur suppression')
      });
    });
  }



  goToCreate(): void {
    this.resetForm();
    this.currentView = 'create';
  }

  goToSearch(): void {
    this.resetForm();
    this.currentView = 'search';
  }



  resetForm(): void {
    this.editingFrais = undefined;
    this.selectedEleve = null;
    this.montant = null;
    this.reduction = 0;
  }

  totalMontant(): number {
    return this.fraisList.reduce((s, f) => s + (f.montant || 0), 0);
  }

  totalReduction(): number {
    return this.fraisList.reduce((s, f) => s + (f.reduction || 0), 0);
  }

  showSuccess(msg: string): void {
    Swal.fire({ icon: 'success', title: 'Succès', text: msg, timer: 2000, showConfirmButton: false });
  }

  showError(msg: string): void {
    Swal.fire({ icon: 'error', title: 'Erreur', text: msg });
  }

  showWarning(msg: string): void {
    Swal.fire({ icon: 'warning', title: 'Attention', text: msg });
  }

}
