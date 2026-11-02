import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Anneeuv } from '../../model/anneeuv';
import { Classe } from '../../model/classe';
import { Ecole } from '../../model/ecole';
import { Emploidutemps } from '../../model/emploidutemps';
import { AnneeuvService } from '../../service/anneeuv.service';
import { AuthService } from '../../service/auth.service';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { EcoleService } from '../../service/ecole.service';
import { EleveecoleService } from '../../service/eleveecole.service';
import { EmploidutempsService } from '../../service/emploidutemps.service';
import { EnseignantService } from '../../service/enseignant.service';
import { PaiementService } from '../../service/paiement.service';
import { PointageService } from '../../service/pointage.service';

interface EvolutionEmplois {
  annee: Anneeuv;
  nombre: number;
}

interface LigneTableauDeBord {
  ecole: Ecole;
  classe: Classe;
  eleves: number;
  emplois: number;
  emargements: number;
  paiements: number;
  honoraires: number;
}

interface ResumeEcole {
  classe: Classe;
  paiements: number;
}

interface SyntheseEcole {
  lignes: LigneTableauDeBord[];
  totalEnseignants: number;
  totalMatieres: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  annees: Anneeuv[] = [];
  ecoles: Ecole[] = [];
  lignes: LigneTableauDeBord[] = [];
  evolutionEmplois: EvolutionEmplois[] = [];
  paiementsGraphique: ResumeEcole[] = [];
  totalEnseignants = 0;
  totalMatieres = 0;
  anneeSelectionnee: number | null = null;
  ecoleSelectionnee: number | null = null;
  loading = false;
  loadingEvolution = false;
  loadingPaiementsGraphique = false;
  loadingFiltres = true;
  hasSearched = false;
  errorMessage = '';
  errorEvolution = '';
  errorPaiementsGraphique = '';

  private indicateursRequestId = 0;
  private evolutionRequestId = 0;
  private paiementsRequestId = 0;

  constructor(
    private authService: AuthService,
    private anneeService: AnneeuvService,
    private ecoleService: EcoleService,
    private classeService: ClasseEcoleService,
    private emploiService: EmploidutempsService,
    private enseignantService: EnseignantService,
    private eleveecoleService: EleveecoleService,
    private paiementService: PaiementService,
    private pointageService: PointageService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromLocalStorage();
    this.chargerDonneesInitiales(user?.parametre?.anneepardefaut?.id);
  }

  get ecolesActives(): Ecole[] {
    return this.ecoleSelectionnee === null
      ? []
      : this.ecoles.filter(ecole => ecole.idEcole === this.ecoleSelectionnee);
  }

  get anneeSelectionneeNom(): string {
    return this.annees.find(annee => annee.id === this.anneeSelectionnee)?.nom ?? '';
  }

  get totalEleves(): number {
    return this.lignes.reduce((total, ligne) => total + ligne.eleves, 0);
  }

  get totalClasses(): number {
    return this.lignes.length;
  }

  get totalEmplois(): number {
    return this.lignes.reduce((total, ligne) => total + ligne.emplois, 0);
  }

  get totalEmargements(): number {
    return this.lignes.reduce((total, ligne) => total + ligne.emargements, 0);
  }

  get totalPaiements(): number {
    return this.lignes.reduce((total, ligne) => total + ligne.paiements, 0);
  }

  get totalHonoraires(): number {
    return this.lignes.reduce((total, ligne) => total + ligne.honoraires, 0);
  }

  get maximumEmplois(): number {
    return Math.max(...this.evolutionEmplois.map(item => item.nombre), 0);
  }

  get maximumPaiementsClasse(): number {
    return Math.max(...this.paiementsGraphique.map(item => item.paiements), 0);
  }

  changerAnnee(anneeId: number): void {
    this.anneeSelectionnee = Number.isSafeInteger(Number(anneeId)) ? Number(anneeId) : null;
    this.invaliderResultats();
    this.chargerGraphiques();
  }

  changerEcole(ecoleId: number | null): void {
    const id = ecoleId === null ? null : Number(ecoleId);
    if (id !== null && !this.ecoles.some(ecole => ecole.idEcole === id)) return;
    this.ecoleSelectionnee = id;
    this.invaliderResultats();
    this.chargerGraphiques();
  }

  rechercher(): void {
    if (this.ecoleSelectionnee === null || this.anneeSelectionnee === null) return;
    this.hasSearched = true;
    this.chargerIndicateurs(this.anneeSelectionnee, this.ecoleSelectionnee);
  }

  reessayer(): void {
    if (!this.ecoles.length || !this.annees.length) {
      this.chargerDonneesInitiales();
      return;
    }
    this.rechercher();
  }

  largeurBarre(nombre: number, maximum: number): number {
    return nombre <= 0 ? 0 : Math.max((nombre / Math.max(maximum, 1)) * 100, 3);
  }

  private chargerDonneesInitiales(anneePrioritaire?: number): void {
    this.loadingFiltres = true;
    this.errorMessage = '';
    this.errorEvolution = '';

    forkJoin({
      annees: this.anneeService.getAll(),
      ecoles: this.ecoleService.getAll()
    }).subscribe({
      next: ({ annees, ecoles }) => {
        this.ecoles = ecoles;
        this.annees = annees;
        this.anneeSelectionnee = annees.find(annee => annee.id === anneePrioritaire)?.id
          ?? annees[0]?.id
          ?? null;
        const ecoleConnecteeId = Number(this.authService.getEcoleId());
        this.ecoleSelectionnee = ecoles.some(ecole => ecole.idEcole === ecoleConnecteeId)
          ? ecoleConnecteeId
          : null;
        this.loadingFiltres = false;
        if (!ecoles.length) this.errorMessage = 'Aucune école n’est disponible.';
        else if (!annees.length) this.errorMessage = 'Aucune année scolaire n’est disponible.';
        else this.chargerGraphiques();
      },
      error: () => {
        this.loadingFiltres = false;
        this.errorMessage = 'Le chargement des écoles et des années scolaires a échoué.';
      }
    });
  }

  private invaliderResultats(): void {
    this.hasSearched = false;
    this.lignes = [];
    this.totalEnseignants = 0;
    this.totalMatieres = 0;
    this.evolutionEmplois = [];
    this.errorMessage = '';
    this.loading = false;
    this.indicateursRequestId++;
  }

  private chargerIndicateurs(anneeId: number, ecoleId: number): void {
    const requestId = ++this.indicateursRequestId;
    this.loading = true;
    this.errorMessage = '';

    const ecole = this.ecoles.find(item => item.idEcole === ecoleId);
    if (!ecole) {
      this.loading = false;
      this.errorMessage = 'L’école sélectionnée n’est pas disponible.';
      return;
    }

    this.chargerLignesEcole(ecole, anneeId).subscribe({
      next: synthese => {
        if (requestId !== this.indicateursRequestId) return;
        this.lignes = synthese.lignes;
        this.totalEnseignants = synthese.totalEnseignants;
        this.totalMatieres = synthese.totalMatieres;
        this.loading = false;
      },
      error: () => {
        if (requestId !== this.indicateursRequestId) return;
        this.lignes = [];
        this.totalEnseignants = 0;
        this.totalMatieres = 0;
        this.loading = false;
        this.errorMessage = 'Le chargement des indicateurs a échoué. Réessayez.';
      }
    });
  }

  private chargerLignesEcole(ecole: Ecole, anneeId: number): Observable<SyntheseEcole> {
    return this.classeService.getAllClasseParEcole(ecole.idEcole).pipe(
      switchMap(classes => forkJoin({
        effectifs: this.combinerOuVide(classes.map(classe =>
          this.eleveecoleService.getByClasseAndAnnee([
            String(anneeId),
            String(ecole.idEcole),
            String(classe.id)
          ])
        )),
        paiements: this.combinerOuVide(classes.map(classe =>
          this.paiementService.search(ecole.idEcole, classe.id, anneeId)
        )),
        pointages: this.pointageService.rechercher({ ecoleId: ecole.idEcole }),
        emplois: this.emploiService.parAnneeAndEcole(anneeId, ecole.idEcole),
        enseignants: this.enseignantService.getEnseignantEcole(ecole.idEcole)
      }).pipe(
        map(({ effectifs, paiements, pointages, emplois, enseignants }) => ({
          lignes: classes.map((classe, index) => {
            const emploisClasse = emplois.filter(emploi => emploi.classe?.id === classe.id);
            const pointagesClasse = pointages.filter(pointage =>
              pointage.emploidutemps?.anneeuv?.id === anneeId &&
              pointage.emploidutemps?.classe?.id === classe.id
            );
            return {
              ecole,
              classe,
              eleves: effectifs[index]?.length ?? 0,
              emplois: emploisClasse.length,
              emargements: pointagesClasse.length,
              paiements: (paiements[index] ?? []).reduce(
                (total, paiement) => total + Number(paiement.montant || 0),
                0
              ),
              honoraires: pointagesClasse
                .filter(pointage => pointage.valider?.trim().toUpperCase() === 'OUI')
                .reduce((total, pointage) => {
                  const heures = Number(pointage.emploidutemps?.matiere?.horaire || 0);
                  const tarif = Number(pointage.enseignant?.tarif || 0);
                  return total + heures * tarif;
                }, 0)
            };
          }),
          totalEnseignants: enseignants.length,
          totalMatieres: new Set(emplois
            .map(emploi => emploi.matiere?.id)
            .filter((id): id is number => Number.isSafeInteger(id))).size
        }))
      ))
    );
  }

  private chargerGraphiques(): void {
    const ecoleId = this.ecoleSelectionnee;
    const anneeId = this.anneeSelectionnee;
    if (ecoleId === null || anneeId === null || !this.annees.length) {
      this.evolutionEmplois = [];
      this.paiementsGraphique = [];
      this.loadingEvolution = false;
      this.loadingPaiementsGraphique = false;
      this.errorEvolution = '';
      this.errorPaiementsGraphique = '';
      this.evolutionRequestId++;
      this.paiementsRequestId++;
      return;
    }

    this.chargerEvolution(ecoleId);
    this.chargerPaiementsGraphique(ecoleId, anneeId);
  }

  private chargerEvolution(ecoleId: number): void {
    const annees = [...this.annees].sort((a, b) => b.id - a.id);
    const requestId = ++this.evolutionRequestId;
    const requetes: Observable<Emploidutemps[]>[] = annees.map(annee =>
      this.emploiService.parAnneeAndEcole(annee.id, ecoleId)
    );

    this.loadingEvolution = true;
    this.errorEvolution = '';
    const emploisParAnnee$ = requetes.length
      ? forkJoin(requetes)
      : of([] as Emploidutemps[][]);

    emploisParAnnee$.subscribe({
      next: resultats => {
        if (requestId !== this.evolutionRequestId) return;
        this.evolutionEmplois = annees.map((annee, index) => {
          return { annee, nombre: resultats[index].length };
        });
        this.loadingEvolution = false;
      },
      error: () => {
        if (requestId !== this.evolutionRequestId) return;
        this.loadingEvolution = false;
        this.errorEvolution = 'L’évolution des emplois du temps n’a pas pu être chargée.';
      }
    });
  }

  private chargerPaiementsGraphique(ecoleId: number, anneeId: number): void {
    const ecole = this.ecoles.find(item => item.idEcole === ecoleId);
    if (!ecole) return;

    const requestId = ++this.paiementsRequestId;
    this.loadingPaiementsGraphique = true;
    this.errorPaiementsGraphique = '';
    this.classeService.getAllClasseParEcole(ecoleId).pipe(
      switchMap(classes => this.combinerOuVide(classes.map(classe =>
        this.paiementService.search(ecoleId, classe.id, anneeId).pipe(
          map(paiements => ({
            classe,
            paiements: paiements.reduce(
              (total, paiement) => total + Number(paiement.montant || 0),
              0
            )
          }))
        )
      )))
    ).subscribe({
      next: paiements => {
        if (requestId !== this.paiementsRequestId) return;
        this.paiementsGraphique = paiements;
        this.loadingPaiementsGraphique = false;
      },
      error: () => {
        if (requestId !== this.paiementsRequestId) return;
        this.paiementsGraphique = [];
        this.loadingPaiementsGraphique = false;
        this.errorPaiementsGraphique = 'Le graphique des paiements n’a pas pu être chargé.';
      }
    });
  }

  private combinerOuVide<T>(requetes: Observable<T>[]): Observable<T[]> {
    return requetes.length ? forkJoin(requetes) : of([]);
  }

}
