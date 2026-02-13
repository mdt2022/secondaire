import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnseignantService } from '../../../service/enseignant.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';

import { Enseignant } from '../../../model/enseignant';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';

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

  // tableau sécurisé avec booléen pour présence et calcul d'heures
  emploisTable: (Emploidutemps & { present: boolean; nbreheure: number })[] = [];

  loading = false;
  idEcole!: number;
  selectedDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService
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

    if (!this.idEcole) console.error('ID école introuvable', user);
  }

  initForm(): void {
    this.emploiForm = this.fb.group({
      jour: [null, Validators.required],
      professeur: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });
  }

  loadEnseignantsParEcole(): void {
    if (!this.idEcole) return;
    this.enseignantService.getEnseignantEcole(this.idEcole).subscribe({
      next: data => this.enseignants = data,
      error: err => console.error(err)
    });
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error(err)
    });
  }

  // ---------------- Affichage ----------------
  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      return;
    }

    const { jour, professeur, anneeuv } = this.emploiForm.value;
    this.loading = true;

    this.selectedDate = this.getDateOfWeek(jour);

    this.emploiService.getAll().subscribe({
      next: data => {
        this.emploisTable = data
          .filter(e =>
            e.jour?.toLowerCase() === (jour || '').toLowerCase() &&
            Number(e.professeur?.id) === Number(professeur) &&
            Number(e.anneeuv?.id) === Number(anneeuv) &&
            Number(e.ecole?.idEcole) === Number(this.idEcole)
          )
          .map(e => ({
            ...e,
            present: false,
            nbreheure: this.calculHeures(e.heuredebut, e.heurefin)
          }));

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // ---------------- Calcul heures ----------------
  calculHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (minutes < 0) minutes = 0;
    return Math.round((minutes / 60) * 100) / 100;
  }

  getDateOfWeek(dayName: string): Date {
    const dayIndex = this.jours.indexOf(dayName);
    const today = new Date();
    const diff = dayIndex - today.getDay() + 1;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  }

  // ---------------- Enregistrer présences ----------------
  savePresence(): void {
    const presentes = this.emploisTable.filter(e => e.present);
    console.log('Présents :', presentes);
    alert(`${presentes.length} présence(s) enregistrée(s) !`);
  }
}
