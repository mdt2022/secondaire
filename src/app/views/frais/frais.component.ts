import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FraiscolaireService } from '../../service/fraiscolaireService';
import { Fraiscolaire } from '../../model/fraiscolaire';
import { ClasseEcole } from '../../model/classeecole';
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
  imports: [CommonModule,
    FormsModule,         
    ReactiveFormsModule],
  templateUrl: './frais.component.html',
  styleUrls: ['./frais.component.scss']
})
export class FraisComponent implements OnInit {

  fraisList: Fraiscolaire[] = [];
  eleves: Eleveecole[] = [];
  classes: Classe[] = [];
  annees: Anneeuv[] = [];

  selectedClasse!: number;
  selectedAnnee!: number;
  montant!: number;
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
    this.anneeService.getAll().subscribe(a => this.annees = a);
    const ecoleId = this.authService.getEcoleId();
this.classeService.getAllClasseParEcole(ecoleId!).subscribe(c => this.classes = c);
  }

  loadEleves() {
    if (!this.selectedClasse || !this.selectedAnnee) {
      this.eleves = [];
      return;
    }
    const ecoleId = this.authService.getEcoleId();
    const body = [this.selectedAnnee.toString(), ecoleId!.toString(), this.selectedClasse.toString()];
    this.eleveService.getByClasseAndAnnee(body).subscribe(e => this.eleves = e);
  }

  searchFrais() {
    if (!this.selectedClasse || !this.selectedAnnee) return;
    const ecoleId = this.authService.getEcoleId();
    this.fraisService.search(ecoleId!, this.selectedClasse, this.selectedAnnee)
      .subscribe(f => this.fraisList = f);
  }

  saveFrais(eleveId: number) {
    const ecoleId = this.authService.getEcoleId();
    const body: Fraiscolaire = {
      id: this.editingFrais?.id || 0,
      ecole: { id: ecoleId } as any,
      classe: { id: this.selectedClasse } as any,
      eleve: { id: eleveId } as any,
      anneeuv: { id: this.selectedAnnee } as any,
      montant: this.montant,
      reduction: this.reduction,
      
    };

    if (this.editingFrais) {
      this.fraisService.update(this.editingFrais.id|| 0, body).subscribe(() => this.searchFrais());
      this.editingFrais = undefined;
    } else {
      this.fraisService.create(body).subscribe(() => this.searchFrais());
    }
  }

  editFrais(frais: Fraiscolaire) {
    this.editingFrais = frais;
    this.selectedClasse = frais.classe.id|| 0;
    this.selectedAnnee = frais.anneeuv.id;
    this.montant = frais.montant;
    this.reduction = frais.reduction;
    this.loadEleves();
  }

  deleteFrais(frais: Fraiscolaire) {
    if (confirm('Confirmer la suppression ?')) {
      this.fraisService.delete(frais.id|| 0).subscribe(() => this.searchFrais());
    }
  }

  totalMontant(): number {
    return this.fraisList.reduce((sum, f) => sum + (f.montant || 0), 0);
  }

  totalReduction(): number {
    return this.fraisList.reduce((sum, f) => sum + (f.reduction || 0), 0);
  }
}
