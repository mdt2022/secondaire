import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AdmissionService } from '../../../service/admission.service';
import { Classe } from '../../../model/classe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  classes: any[] = [];
  annees: any[] = [];
  eleves: any[] = [];

  classeId!: number;
  anneeId!: number;
  ecoleId!: number;
  examen!: string;
  sessionId!: number;
  nomEcole!: string;

  constructor(
    private admissionService: AdmissionService,
    private classeEcoleService: ClasseEcoleService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.ecoleId = user.administrateur.ecole.idEcole;
    this.nomEcole = user.administrateur.ecole.nomEcole;

    this.chargerClasses();
    this.chargerAnnees();
  }

  chargerClasses() {
  this.classeEcoleService.getAllClasseParEcole(this.ecoleId).subscribe({
    next: (res: Classe[]) => {
      this.classes = res;  
    }
  });
}

  chargerAnnees() {
    this.anneeService.getAll().subscribe({
      next: (res: any[]) => this.annees = res
    });
  }

  rechercher() {

  if (!this.classeId || !this.anneeId) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs obligatoires',
      text: "Choisissez la classe et l'année",
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  this.admissionService
    .getElevesAdmis(this.classeId, this.anneeId, this.ecoleId)
    .subscribe({
      next: res => {
        this.eleves = res.map(e => ({
          ...e,
          checked: false
        }));

        if (this.eleves.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Aucun élève',
            text: 'Aucun élève trouvé pour cette recherche'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la récupération des élèves'
        });
      }
    });
}

  toutCocher(event: any) {
  const checked = event.target.checked;
  this.eleves.forEach(e => e.checked = checked);

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: checked ? 'Tous les élèves sélectionnés' : 'Sélection annulée',
    showConfirmButton: false,
    timer: 1500
  });
}

validerAdmission() {

  if (!this.examen || !this.sessionId) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs obligatoires',
      text: "Choisissez l'examen et la session"
    });
    return;
  }

  const selectionnes = this.eleves.filter(e => e.checked);

  if (selectionnes.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune sélection',
      text: "Sélectionnez au moins un élève"
    });
    return;
  }

  Swal.fire({
    title: 'Confirmer l’admission ?',
    text: `${selectionnes.length} élève(s) seront admis à l'examen`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, admettre',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#28a745'
  }).then(result => {

    if (result.isConfirmed) {

      const data = {
        eleveecoleIds: selectionnes.map(e => e.id),
        examen: this.examen,
        sessionId: this.sessionId
      };

      this.admissionService.envoyerExamen(data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Admission effectuée avec succès '
          });

          // décocher après succès
          this.eleves.forEach(e => e.checked = false);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de l'admission"
          });
        }
      });
    }
  });
}
}