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
  toastMessage = '';
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
  getEcoleFromUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.idEcole =
      user?.parametre?.ecole?.idEcole ||
      user?.administrateur?.ecole?.idEcole;

  }
  initForm(): void {
    this.emploiForm = this.fb.group({
      jour: [null, Validators.required],
      professeur: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });
  }
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
  onSubmit(): void {
    if (this.emploiForm.invalid) return;
    const { jour, professeur, anneeuv } = this.emploiForm.value;
    this.loading = true;
    this.selectedDate = new Date();
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
  calculHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    const minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    return minutes / 60;
  }
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
  togglePresence(row: any): void {
    row.present = !row.present;
    console.log("========== CHECKBOX ==========");
    console.log("ID emploi :", row.id);
    console.log("Prof :", row.professeur?.prenom, row.professeur?.nom);
    console.log("Present :", row.present);
    console.log("Date :", new Date());
  }
  savePresence(): void {

    console.log("===== SAVE PRESENCE CLICK =====");

    const presentes = this.emploisTable.filter(e => e.present);

    console.log("Présences sélectionnées :", presentes);

    if (presentes.length === 0) {

      console.warn("Aucune présence sélectionnée");

      this.toastMessage = 'Aucune présence sélectionnée';

      setTimeout(() => this.toastMessage = '', 3000);

      return;

    }

    presentes.forEach(row => {

      const today = new Date().toISOString().split('T')[0];

      console.log("-----------");
      console.log("Row complet :", row);
      console.log("ID emploi :", row.id);
      console.log("ID enseignant :", row.professeur?.id);

      const pointage: any = {

        emploidutemps: {
          id: row.id
        },

        enseignant: {
          id: row.professeur?.id
        },

        valider: "OUI",

        datevalider: today

      };

      console.log("Objet envoyé au backend :", JSON.stringify(pointage));

      this.pointageService.create(pointage).subscribe({

        next: res => {

          console.log("✅ SUCCÈS BACKEND :", res);

          this.toastMessage =
            `${row.professeur.prenom} ${row.professeur.nom} pointé avec succès`;

          setTimeout(() => this.toastMessage = '', 3000);

          row.present = false;

        },

        error: err => {

          console.error("❌ ERREUR BACKEND :", err);

          console.error("Status :", err.status);

          console.error("Message :", err.message);

          console.error("Error body :", err.error);

          this.toastMessage =
            `Erreur lors du pointage de ${row.professeur.prenom}`;

          setTimeout(() => this.toastMessage = '', 3000);

        }

      });

    });

  }

}
