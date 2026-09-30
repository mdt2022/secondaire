import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, type Plugin } from 'chart.js';
import { Anneeuv } from '../../../model/anneeuv';
import { Classe } from '../../../model/classe';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import Swal from 'sweetalert2';

interface StatistiqueClasse {
  id: number;
  nom: string;
  nombre: number;
  pourcentage: number;
}

const valeursGraphique: Plugin<'bar'> = {
  id: 'valeurs-effectif',
  afterDatasetsDraw(chart) {
    const contexte = chart.ctx;
    const donnees = chart.data.datasets[0]?.data ?? [];
    const elements = chart.getDatasetMeta(0).data;

    contexte.save();
    contexte.fillStyle = '#18252f';
    contexte.font = '600 12px sans-serif';
    contexte.textBaseline = 'middle';
    elements.forEach((element, index) => {
      const valeur = donnees[index];
      if (typeof valeur === 'number') contexte.fillText(String(valeur), element.x + 8, element.y);
    });
    contexte.restore();
  }
};

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.scss'
})
export class StatistiqueComponent implements OnInit {
  private graphiqueCanvas: HTMLCanvasElement | null = null;
  private graphique: Chart | null = null;

  @ViewChild('effectifChart')
  set effectifChart(element: ElementRef<HTMLCanvasElement> | undefined) {
    this.graphiqueCanvas = element?.nativeElement ?? null;
    this.mettreAJourGraphique();
  }

  annees: Anneeuv[] = [];
  classes: Classe[] = [];
  statistiques: StatistiqueClasse[] = [];
  anneeId: number | null = null;
  ecoleId: number | null = null;
  totalEleves = 0;
  moyenneParClasse = 0;
  loading = true;
  errorMessage = '';
  private requestVersion = 0;

  constructor(
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private eleveecoleService: EleveecoleService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.ecoleId = user?.administrateur?.ecole?.idEcole ?? user?.parametre?.ecole?.idEcole ?? null;
    const anneeParDefaut = user?.parametre?.anneepardefaut?.id;

    if (!this.ecoleId) {
      this.loading = false;
      this.errorMessage = 'Impossible d’identifier l’établissement connecté.';
      Swal.fire('Erreur', this.errorMessage, 'error');
      return;
    }

    forkJoin({
      annees: this.anneeService.getAll(),
      classes: this.classeService.getAllClasseParEcole(this.ecoleId)
    }).subscribe({
      next: ({ annees, classes }) => {
        this.annees = annees;
        this.classes = classes;
        this.anneeId = annees.some(annee => annee.id === anneeParDefaut)
          ? anneeParDefaut
          : annees[0]?.id ?? null;

        if (this.anneeId !== null) this.chargerStatistiques();
        else this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Le chargement des années et des classes a échoué.';
        Swal.fire('Erreur', this.errorMessage, 'error');
      }
    });
  }

  changerAnnee(anneeId: number): void {
    this.anneeId = anneeId;
    this.chargerStatistiques();
  }

  get classePlusNombreuse(): StatistiqueClasse | null {
    return this.statistiques.reduce<StatistiqueClasse | null>(
      (plusNombreuse, classe) => !plusNombreuse || classe.nombre > plusNombreuse.nombre ? classe : plusNombreuse,
      null
    );
  }

  get graphiqueHauteur(): number {
    return Math.max(260, this.statistiques.length * 44);
  }

  chargerStatistiques(): void {
    if (this.anneeId === null || this.ecoleId === null) return;

    const version = ++this.requestVersion;
    this.loading = true;
    this.errorMessage = '';
    const requetes = this.classes.map(classe => this.eleveecoleService.getByClasseAndAnnee([
      String(this.anneeId),
      String(this.ecoleId),
      String(classe.id)
    ]));

    if (requetes.length === 0) {
      this.statistiques = [];
      this.totalEleves = 0;
      this.moyenneParClasse = 0;
      this.loading = false;
      return;
    }

    forkJoin(requetes).subscribe({
      next: resultats => {
        if (version !== this.requestVersion) return;

        this.totalEleves = resultats.reduce((total, inscriptions) => total + inscriptions.length, 0);
        this.moyenneParClasse = this.classes.length ? this.totalEleves / this.classes.length : 0;
        this.statistiques = resultats.map((inscriptions, index) => ({
          id: this.classes[index].id,
          nom: this.classes[index].nom,
          nombre: inscriptions.length,
          pourcentage: this.totalEleves ? inscriptions.length / this.totalEleves * 100 : 0
        }));
        this.mettreAJourGraphique();
        this.loading = false;
      },
      error: () => {
        if (version !== this.requestVersion) return;
        this.loading = false;
        this.errorMessage = 'Le chargement des effectifs a échoué. Réessayez.';
        Swal.fire('Erreur', this.errorMessage, 'error');
      }
    });
  }

  private mettreAJourGraphique(): void {
    this.graphique?.destroy();
    this.graphique = null;
    if (!this.graphiqueCanvas || this.totalEleves === 0) return;

    this.graphique = new Chart(this.graphiqueCanvas, {
      type: 'bar',
      data: {
        labels: this.statistiques.map(statistique => statistique.nom),
        datasets: [{
          data: this.statistiques.map(statistique => statistique.nombre),
          backgroundColor: '#087e79',
          borderRadius: 2,
          barThickness: 22
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        layout: { padding: { right: 36 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: contexte => {
                const statistique = this.statistiques[contexte.dataIndex];
                return ` ${statistique.nombre} élèves (${statistique.pourcentage.toFixed(1)} %)`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, suggestedMax: Math.max(...this.statistiques.map(statistique => statistique.nombre)) * 1.2, ticks: { precision: 0 } },
          y: { grid: { display: false } }
        }
      },
      plugins: [valeursGraphique]
    });
  }
}

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);
