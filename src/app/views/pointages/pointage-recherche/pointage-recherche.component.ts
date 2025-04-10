import { ActivatedRoute } from '@angular/router';
import { PointageService } from '../../../service/pointage.service'; // À adapter si besoin
import { OnInit, Component } from '@angular/core';
import { Pointage } from '../../../model/pointage.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pointage-recherche',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pointage-recherche.component.html',
  styleUrl: './pointage-recherche.component.scss'
})
export class PointageRechercheComponent implements OnInit {

  pointages: Pointage[] = [];
  montantTotal: number = 0;
  avance: number = 0;
  enseignantId!: number;
  dateDebut!: string;
  dateFin!: string;
  empreintes: any[] = [];
  filteredEmpreintes: any[] = [...this.empreintes];
  search: any;

  constructor(private route: ActivatedRoute, private pointageService: PointageService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.enseignantId = params['enseignant'];
      this.dateDebut = params['dateDebut'];
      this.dateFin = params['dateFin'];

      // Appel au backend pour récupérer les pointages filtrés
      this.loadPointages();
    });
  }

  loadPointages() {
    this.pointageService.getAllPointage(this.search)
      .subscribe((data: Pointage[]) => {
        console.log(data);
        this.pointages = data;

        this.calculateMontantTotal();
      }, (error) => {
        console.error('Erreur lors de la récupération des pointages', error);
      });

    this.empreintes = JSON.parse(localStorage.getItem('empreintes') || '[]');
this.filteredEmpreintes = [...this.empreintes];
  }

  calculateMontant(pointages: Pointage): number {
    return pointages.enseignant.tarif * pointages.emploidutemp.matiere.horaire;
  }

  calculateMontantTotal() {
    this.montantTotal = this.pointages.reduce((total, p) => total + this.calculateMontant(p), 0);
  }


}
