import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnseignantService } from '../../../service/enseignant.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { PointageService } from '../../../service/pointage.service';

import { Enseignant } from '../../../model/enseignant';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';
import { Pointage } from '../../../model/pointage';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.scss']
})
export class EnseignantComponent implements OnInit {

  emploiForm!: FormGroup;

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  enseignants: Enseignant[] = [];
  annees: Anneeuv[] = [];

  emploisTable: (Emploidutemps & { present: boolean; nbreheure: number })[] = [];
  pagedEmplois: (Emploidutemps & { present: boolean; nbreheure: number })[] = [];

  loading = false;
  idEcole!: number;

  selectedDate: Date = new Date();

  page = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private pointageService: PointageService
  ) { }

  ngOnInit(): void {
    this.getEcoleFromUser();
    this.initForm();
    this.loadEnseignantsParEcole();
    this.loadAnnees();
  }

  // ================================
  // RECUP ID ECOLE
  // ================================

  getEcoleFromUser(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.idEcole =
      user?.parametre?.ecole?.idEcole ||
      user?.administrateur?.ecole?.idEcole;

  }

  // ================================
  // FORM
  // ================================

  initForm(): void {

    this.emploiForm = this.fb.group({

      jour: [null, Validators.required],
      professeur: [null, Validators.required],
      anneeuv: [null, Validators.required]

    });

  }

  // ================================
  // LOAD DATA
  // ================================

  loadEnseignantsParEcole(): void {

    this.enseignantService.getEnseignantEcole(this.idEcole).subscribe({

      next: data => this.enseignants = data

    });

  }

  loadAnnees(): void {

    this.anneeService.getAll().subscribe({

      next: data => this.annees = data

    });

  }

  // ================================
  // AFFICHAGE
  // ================================

  onSubmit(): void {

    if (this.emploiForm.invalid) return;

    const { jour, professeur, anneeuv } = this.emploiForm.value;

    this.loading = true;

    this.selectedDate = new Date(); // DATE DU JOUR

    this.emploiService.getAll().subscribe({

      next: data => {

        this.emploisTable = data

          .filter(e =>

            e.jour?.toLowerCase() === jour.toLowerCase() &&

            e.professeur?.id == professeur &&

            e.anneeuv?.id == anneeuv &&

            e.ecole?.idEcole == this.idEcole

          )

          .map(e => ({

            ...e,

            present: false,

            nbreheure: this.calculHeures(e.heuredebut, e.heurefin)

          }));

        this.page = 1;

        this.totalPages = Math.ceil(this.emploisTable.length / this.pageSize);

        this.updatePage();

        this.loading = false;

      }

    });

  }

  // ================================
  // CALCUL HEURES
  // ================================

  calculHeures(debut: string, fin: string): number {

    if (!debut || !fin) return 0;

    const [h1, m1] = debut.split(':').map(Number);

    const [h2, m2] = fin.split(':').map(Number);

    const minutes = (h2 * 60 + m2) - (h1 * 60 + m1);

    return minutes / 60;

  }

  // ================================
  // PAGINATION
  // ================================

  updatePage(): void {

    const start = (this.page - 1) * this.pageSize;

    this.pagedEmplois = this.emploisTable.slice(start, start + this.pageSize);

  }

  nextPage(): void {

    this.page++;

    this.updatePage();

  }

  prevPage(): void {

    this.page--;

    this.updatePage();

  }
  // ================================
  // TOGGLE CHECKBOX
  // ================================

  togglePresence(row: any): void {

    row.present = !row.present;

    console.log("========== CHECKBOX ==========");

    console.log("ID emploi :", row.id);

    console.log("Prof :", row.professeur?.prenom, row.professeur?.nom);

    console.log("Present :", row.present);

    console.log("Date :", new Date());

  }


  // ================================
  // SAVE POINTAGE
  // ================================

  savePresence(): void {

    const presentes = this.emploisTable.filter(e => e.present);

    presentes.forEach(row => {

      const today = new Date().toISOString().split('T')[0];

      this.pointageService.rechercher({

        enseignantId: row.professeur.id,
        dateDebut: today,
        dateFin: today

      }).subscribe(existing => {

        if (existing.length > 0) {

          console.warn("DEJA POINTÉ");

          alert(row.professeur.prenom + " déjà pointé aujourd'hui");

          return;

          
        }

        const pointage = {

          id: 0,
          emploidutemps: row,
          enseignant: row.professeur,
          valider: "OUI",
          datevalider: today

        };

        this.pointageService.create(pointage).subscribe({

          next: res => {

            console.log("POINTAGE OK", res);

          }

        });

      });

    });

  }

}
