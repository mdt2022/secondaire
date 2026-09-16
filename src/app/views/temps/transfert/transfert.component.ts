import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Anneeuv } from '../../../model/anneeuv';
import { Ecole } from '../../../model/ecole';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EcoleService } from '../../../service/ecole.service';
import { EmploidutempsService, TransferResult } from '../../../service/emploidutemps.service';

@Component({
  selector: 'app-transfert-emploi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent implements OnInit {
  transfertForm!: FormGroup;
  annees: Anneeuv[] = [];
  ecoles: Ecole[] = [];
  loading = false;
  message = '';
  erreur = '';
  resultat?: TransferResult;

  constructor(
    private fb: FormBuilder,
    private anneeService: AnneeuvService,
    private ecoleService: EcoleService,
    private emploiService: EmploidutempsService,
  ) {}

  ngOnInit(): void {
    this.transfertForm = this.fb.group({
      ecole: [null, Validators.required],
      sourceAnnee: [null, Validators.required],
      cibleAnnee: [null, Validators.required]
    });

    this.anneeService.getAll().subscribe({
      next: annees => this.annees = annees,
      error: () => Swal.fire('Erreur', 'Impossible de charger les années scolaires.', 'error')
    });

    this.ecoleService.getAll().subscribe({
      next: ecoles => this.ecoles = ecoles,
      error: () => Swal.fire('Erreur', 'Impossible de charger les écoles.', 'error')
    });
  }

  transferer(): void {
    if (this.transfertForm.invalid) {
      this.transfertForm.markAllAsTouched();
      Swal.fire('Information', 'Veuillez sélectionner une école, une année source et une année cible.', 'info');
      return;
    }

    const { ecole, sourceAnnee, cibleAnnee } = this.transfertForm.value;
    if (sourceAnnee === cibleAnnee) {
      Swal.fire('Attention', 'Les années source et cible doivent être différentes.', 'warning');
      return;
    }

    const ecoleId = Number(ecole);
    const source = this.annees.find(annee => annee.id === Number(sourceAnnee));
    const cible = this.annees.find(annee => annee.id === Number(cibleAnnee));
    const ecoleSelectionnee = this.ecoles.find(item => item.idEcole === ecoleId);
    Swal.fire({
      title: 'Confirmer le transfert',
      text: `Transférer les emplois de « ${source?.nom} » vers « ${cible?.nom} » pour « ${ecoleSelectionnee?.nomEcole} » ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, transférer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.loading = true;
      this.resultat = undefined;

      this.emploiService.transferer(Number(sourceAnnee), Number(cibleAnnee), ecoleId).subscribe({
        next: resultat => {
          this.resultat = resultat;
          this.loading = false;
          Swal.fire(
            'Transfert terminé',
            `${resultat.transferes} emploi(s) transféré(s), ${resultat.ignores} déjà présent(s).`,
            'success'
          );
        },
        error: err => {
          this.loading = false;
          Swal.fire(
            'Erreur',
            err?.error?.message || 'Le transfert n’a pas pu être effectué.',
            'error'
          );
        }
      });
    });
  }
}