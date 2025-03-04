import { AnneeuvService } from '../../../service/anneeuv.service';
import { Component, OnInit, } from '@angular/core';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Djournalier',
  standalone:true,
  imports:[
    FormsModule,
    CommonModule
  ],
  templateUrl: './Djournalier.component.html',
  styleUrls: ['./Djournalier.component.scss']
})
export class DjournalierComponent implements OnInit {
  annees: any[] = [];
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  selectedAnnee: string = '';
  selectedJour: string = '';
  emploiDuTemps: any[] = [];

  constructor(private anneeuvService: AnneeuvService, private emploiService: EmploidutempService) {}

  ngOnInit(): void {
    this.loadAnnees();
  }

  loadAnnees(): void {
    this.anneeuvService.getAllAnnee().subscribe((data) => {
      this.annees = data;
    });
  }

  afficherEmploi(): void {
    if (this.selectedAnnee && this.selectedJour) {
      this.emploiService.getEmploiDuTempsParJour(this.selectedAnnee, this.selectedJour).subscribe({
        next:  (data) => {
          this.emploiDuTemps = data;
        }, 
        error: (error) => {
          console.error('Erreur lors du chargement des emplois du temps', error);
        }
      });
    }
  }
  
}
