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
  emploisTable: Emploidutemps[] = [];

  loading = false;
  idEcole!: number;

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

    if (!this.idEcole) {
      console.error('ID école introuvable', user);
    }
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

  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      return;
    }

    const { jour, professeur, anneeuv } = this.emploiForm.value;
    this.loading = true;

    this.emploiService.getAll().subscribe({
      next: data => {
        this.emploisTable = data.filter(e =>
          e.jour === jour &&
          e.professeur?.id === professeur &&
          e.anneeuv?.id === anneeuv &&
          e.ecole?.idEcole === this.idEcole
        );
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  calculHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;

    const d1 = new Date(`1970-01-01T${debut}`);
    const d2 = new Date(`1970-01-01T${fin}`);

    return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60);
  }
}
