import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { AvanceService } from '../../service/avance.service';
import { EnseignantService } from '../../service/enseignant.service';
import { AnneeuvService } from '../../service/anneeuv.service';

@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './avance.component.html',
})
export class AvanceComponent implements OnInit {

  enseignants: any[] = [];
  annees: any[] = [];
  avances: any[] = [];

  p: number = 1;
  itemsParPage: number = 8;

  ecoleId!: number;

  mode: 'search' | 'list' | 'form' = 'search';

  recherche = {
    enseignant: '',
    mois: '',
    anneescolaire: ''
  };

  nouvelleAvance: any = this.resetForm();
  
  getNomMois(id: number): string {
  const moisTrouve = this.mois.find(m => m.id == id);
  return moisTrouve ? moisTrouve.nom : '';
}

  mois = [
    { id: 1, nom: 'Janvier' }, { id: 2, nom: 'Février' },
    { id: 3, nom: 'Mars' }, { id: 4, nom: 'Avril' },
    { id: 5, nom: 'Mai' }, { id: 6, nom: 'Juin' },
    { id: 7, nom: 'Juillet' }, { id: 8, nom: 'Août' },
    { id: 9, nom: 'Septembre' }, { id: 10, nom: 'Octobre' },
    { id: 11, nom: 'Novembre' }, { id: 12, nom: 'Décembre' }
  ];

  constructor(
    private avanceService: AvanceService,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.ecoleId = user.administrateur.ecole.idEcole;

    this.enseignantService.getEnseignantEcole(this.ecoleId)
      .subscribe(res => this.enseignants = res);

    this.anneeService.getAll()
      .subscribe(res => this.annees = res);
  }

  //  Reset formulaire
  resetForm() {
    return {
      montant: '',
      mois: '',
      anneescolaire: '',
      dateempreint: new Date().toISOString().substring(0, 10),
      enseignant: null,
      paie: 0,
      datedepaie: ''
    };
  }

  // INDEX -> SEARCH
 rechercher() {

  let params: any = {};

  if (this.recherche.enseignant) {
    params.enseignant = this.recherche.enseignant;
  }

  if (this.recherche.mois) {
    params.mois = this.recherche.mois;
  }

  if (this.recherche.anneescolaire) {
    params.anneescolaire = this.recherche.anneescolaire;
  }

  // Si aucun filtre, on demande tout
  if (Object.keys(params).length === 0) {
    this.avanceService.getAll().subscribe(res => {
      this.avances = res;
      this.mode = 'list';
      this.p = 1;
    });
  } else {
    this.avanceService.rechercher(params).subscribe(res => {
      this.avances = res;
      this.mode = 'list';
      this.p = 1;
    });
  }
}

  // SEARCH -> NEW
  allerFormulaire() {
    this.nouvelleAvance = this.resetForm();
    this.mode = 'form';
  }

  //  LIST -> SEARCH
  retourRecherche() {
    this.mode = 'search';
  }

  //  FORM -> LIST
  retourListe() {
    this.mode = 'list';
  }

  // Enregistrer
  enregistrer() {
    this.avanceService.create(this.nouvelleAvance).subscribe(() => {
      Swal.fire('Succès', 'Empreint enregistré', 'success');
      this.rechercher(); // revient sur la liste automatiquement
    });
  }

  // Payer (edit)
  payer(id: number) {
    Swal.fire({ title: 'Payer ?', showCancelButton: true }).then(r => {
      if (r.isConfirmed) {
        this.avanceService.payer(id).subscribe(() => {
          Swal.fire('Payé', '', 'success');
          this.rechercher();
        });
      }
    });
  }

  // Supprimer
  supprimer(id: number) {
    Swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true })
      .then(r => {
        if (r.isConfirmed) {
          this.avanceService.supprimer(id).subscribe(() => {
            Swal.fire('Supprimé', '', 'success');
            this.rechercher();
          });
        }
      });
  }
}