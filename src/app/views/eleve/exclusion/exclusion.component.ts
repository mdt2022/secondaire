import { Component, OnInit } from '@angular/core';
import { ExclusionService } from '../../../service/exclusion.service';
import { EleveService } from '../../../service/eleve.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { CommonModule } from '@angular/common';
import { FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-exclusion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exclusion.component.html',
  styleUrl: './exclusion.component.scss'
})
export class ExclusionComponent implements OnInit {

  classes: any[] = [];
  annees: any[] = [];
  eleves: any[] = [];

  classeId!: number;
  anneeId!: number;
  ecoleId!: number;
  nomEcole!: string;

  selectedEleves: number[] = [];
  motif: string = '';

  constructor(
    private exclusionService: ExclusionService,
    private eleveEcoleService: EleveecoleService,
    private classeEcoleService: ClasseEcoleService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.ecoleId = user.administrateur.ecole.idEcole;
this.nomEcole = user.administrateur.ecole.nomEcole;
    this.classeEcoleService.getAllClasseParEcole(this.ecoleId)
      .subscribe(res => this.classes = res);

    this.anneeService.getAll()
      .subscribe(res => this.annees = res);
  }

  //  RECHERCHE
  rechercher() {

  if (!this.classeId || !this.anneeId) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs obligatoires',
      text: 'Veuillez choisir la classe et l’année.'
    });
    return;
  }
  const donnees = [
    this.anneeId.toString(),  // an
    this.ecoleId.toString(),  // ecole
    this.classeId.toString()  // classe
  ];

  this.eleveEcoleService
      .getByClasseAndAnnee(donnees)
      .subscribe(res => {
        this.eleves = res;
        this.selectedEleves = [];
      });
}

toggleAll(event: any) {
  if (event.target.checked) {
    this.selectedEleves = this.eleves.map(e => e.id!);
  } else {
    this.selectedEleves = [];
  }
}

toggleEleve(id: number, event: any) {
  if (event.target.checked) {
    this.selectedEleves.push(id);
  } else {
    this.selectedEleves = this.selectedEleves.filter(e => e !== id);
  }
}
exclure() {

  if (this.selectedEleves.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucun élève sélectionné',
      text: 'Veuillez sélectionner au moins un élève.'
    });
    return;
  }

  if (!this.motif) {
    Swal.fire({
      icon: 'warning',
      title: 'Motif manquant',
      text: 'Veuillez saisir le motif de l’exclusion.'
    });
    return;
  }

  Swal.fire({
    title: 'Confirmer l’exclusion ?',
    text: `Vous allez exclure ${this.selectedEleves.length} élève(s).`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, exclure',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#d33'
  }).then(result => {

    if (result.isConfirmed) {

      this.exclusionService.exclure({
        elevesIds: this.selectedEleves,
        classe: this.classeId,
        anneeuv: this.anneeId,
        ecole: this.ecoleId,
        motif: this.motif
      }).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Exclusion effectuée',
            text: 'Les élèves ont été exclus avec succès.'
          });

          this.rechercher();
          this.motif = '';
          this.selectedEleves = [];
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l’exclusion.'
          });
        }
      });

    }

  });
}
}
