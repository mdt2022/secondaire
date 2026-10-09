import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { Anneeuv } from '../../model/anneeuv';
import { Classe } from '../../model/classe';
import { Emploidutemps } from '../../model/emploidutemps';
import { Eleveecole } from '../../model/eleveecole';
import { Paiement } from '../../model/paiement';
import { Pointage } from '../../model/pointage';
import { AnneeuvService } from '../../service/anneeuv.service';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { EleveecoleService } from '../../service/eleveecole.service';
import { EmploidutempsService } from '../../service/emploidutemps.service';
import { PaiementService } from '../../service/paiement.service';
import { PointageService } from '../../service/pointage.service';
import { AuthService } from '../../service/auth.service';

interface EvolutionEmplois {
  annee: Anneeuv;
  nombre: number;
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
  classes: Classe[] = [];
  evolutionEmplois: EvolutionEmplois[] = [];
  anneeSelectionnee: number | null = null;
  roleNom = '';
  ecoleNom = '';
  loading = true;
  loadingEvolution = true;
  errorMessage = '';
  errorEvolution = '';

  totalEmplois = 0;
  totalEmargements = 0;
  totalEleves = 0;
  totalPaiements = 0;
  totalHonorairesBruts = 0;

  private ecoleId: number | null = null;
  private indicateursRequestId = 0;

  constructor(
    private authService: AuthService,
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private emploiService: EmploidutempsService,
    private eleveecoleService: EleveecoleService,
    private paiementService: PaiementService,
    private pointageService: PointageService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromLocalStorage();
    this.ecoleId = Number(
      user?.administrateur?.ecole?.idEcole ??
      user?.parametre?.ecole?.idEcole ??
      0
    ) || null;
    this.roleNom = user?.administrateur?.role?.nom || 'Gestion';
    this.ecoleNom = user?.administrateur?.ecole?.nomEcole || '';

    if (this.ecoleId === null) {
      this.loading = false;
      this.loadingEvolution = false;
      this.errorMessage = 'Impossible d’identifier l’établissement connecté.';
      return;
    }

    this.chargerDonneesInitiales(user?.parametre?.anneepardefaut?.id);
  }

  private chargerDonneesInitiales(anneePrioritaire?: number): void {
    if (this.ecoleId === null) return;
    this.loading = true;
    this.loadingEvolution = true;
    this.errorMessage = '';
    this.errorEvolution = '';

    forkJoin({
      annees: this.anneeService.getAll(),
      classes: this.classeService.getAllClasseParEcole(this.ecoleId)
    }).subscribe({
      next: ({ annees, classes }) => {
        this.annees = annees;
        this.classes = classes;
        this.anneeSelectionnee = annees.find(annee => annee.id === anneePrioritaire)?.id
          ?? annees[0]?.id
          ?? null;

        this.chargerEvolution();
        if (this.anneeSelectionnee === null) {
          this.loading = false;
          this.errorMessage = 'Aucune année scolaire n’est disponible.';
          return;
        }
        this.chargerIndicateurs(this.anneeSelectionnee);
      },
      error: () => {
        this.loading = false;
        this.loadingEvolution = false;
        this.errorMessage = 'Le chargement des années et des classes a échoué.';
      }
    });
  }

  changerAnnee(anneeId: number): void {
    this.anneeSelectionnee = Number(anneeId);
    this.chargerIndicateurs(this.anneeSelectionnee);
  }

  reessayer(): void {
    if (this.ecoleId === null) return;
    this.chargerDonneesInitiales(this.anneeSelectionnee ?? undefined);
  }

  largeurBarre(nombre: number): number {
    const maximum = Math.max(this.maximumEmplois, 1);
    return nombre === 0 ? 0 : Math.max((nombre / maximum) * 100, 3);
  }

  get maximumEmplois(): number {
    return Math.max(...this.evolutionEmplois.map(item => item.nombre), 0);
  }

  get maximumActivite(): number {
    return Math.max(this.totalEmplois, this.totalEmargements, this.totalEleves, this.classes.length, 0);
  }

  get maximumFinancier(): number {
    return Math.max(this.totalPaiements, this.totalHonorairesBruts, 0);
  }

  largeurActivite(nombre: number): number {
    return this.largeurRelative(nombre, this.maximumActivite);
  }

  largeurFinanciere(montant: number): number {
    return this.largeurRelative(montant, this.maximumFinancier);
  }

  private largeurRelative(valeur: number, maximum: number): number {
    return valeur <= 0 ? 0 : Math.max((valeur / Math.max(maximum, 1)) * 100, 2);
  }

  private chargerEvolution(): void {
    if (this.ecoleId === null) return;
    const ecoleId = this.ecoleId;
    this.loadingEvolution = true;
    this.errorEvolution = '';

    const annees = [...this.annees].sort((a, b) => b.id - a.id);
    const requetes: Observable<Emploidutemps[]>[] = annees.map(annee =>
      this.emploiService.parAnneeAndEcole(annee.id, ecoleId)
    );
    const emploisParAnnee$ = requetes.length
      ? forkJoin(requetes)
      : of([] as Emploidutemps[][]);

    emploisParAnnee$.subscribe({
      next: resultats => {
        this.evolutionEmplois = resultats.map((emplois, index) => ({
          annee: annees[index],
          nombre: emplois.length
        }));
        this.loadingEvolution = false;
        this.mettreAJourTotalEmplois();
      },
      error: () => {
        this.loadingEvolution = false;
        this.errorEvolution = 'L’évolution des emplois du temps n’a pas pu être chargée.';
      }
    });
  }

  private chargerIndicateurs(anneeId: number): void {
    if (this.ecoleId === null) return;
    const ecoleId = this.ecoleId;

    const requestId = ++this.indicateursRequestId;
    this.loading = true;
    this.errorMessage = '';

    const effectifs$ = this.combinerOuVide(this.classes.map(classe =>
      this.eleveecoleService.getByClasseAndAnnee([
        String(anneeId),
        String(ecoleId),
        String(classe.id)
      ])
    ));
    const paiements$ = this.combinerOuVide(this.classes.map(classe =>
      this.paiementService.search(ecoleId, classe.id, anneeId)
    ));

    forkJoin({
      effectifs: effectifs$,
      paiements: paiements$,
      pointages: this.pointageService.rechercher({ ecoleId })
    }).subscribe({
      next: ({ effectifs, paiements, pointages }) => {
        if (requestId !== this.indicateursRequestId) return;

        const pointagesAnnee = pointages.filter(pointage =>
          pointage.emploidutemps?.anneeuv?.id === anneeId
        );
        this.totalEleves = effectifs.reduce((total, inscriptions) => total + inscriptions.length, 0);
        this.totalPaiements = paiements.reduce(
          (total, paiementsClasse) => total + paiementsClasse.reduce(
            (somme, paiement) => somme + Number(paiement.montant || 0),
            0
          ),
          0
        );
        this.totalEmargements = pointagesAnnee.length;
        this.totalHonorairesBruts = pointagesAnnee
          .filter(pointage => pointage.valider?.trim().toUpperCase() === 'OUI')
          .reduce((total, pointage) => {
            const heures = Number(pointage.emploidutemps?.matiere?.horaire || 0);
            const tarif = Number(pointage.enseignant?.tarif || 0);
            return total + heures * tarif;
          }, 0);
        this.mettreAJourTotalEmplois();
        this.loading = false;
      },
      error: () => {
        if (requestId !== this.indicateursRequestId) return;
        this.loading = false;
        this.errorMessage = 'Le chargement des indicateurs a échoué. Réessayez.';
      }
    });
  }

  private mettreAJourTotalEmplois(): void {
    this.totalEmplois = this.evolutionEmplois.find(
      item => item.annee.id === this.anneeSelectionnee
    )?.nombre ?? 0;
  }

  private combinerOuVide<T>(requetes: Observable<T>[]): Observable<T[]> {
    return requetes.length ? forkJoin(requetes) : of([]);
  }
}
