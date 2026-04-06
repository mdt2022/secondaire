import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { EnseignerService } from '../../../service/enseigner.service';

import { Emploidutemps } from '../../../model/emploidutemps';
import { Anneeuv } from '../../../model/anneeuv';
import { Enseignant } from '../../../model/enseignant';
import { Enseigner } from '../../../model/enseigner';

@Component({
  selector: 'app-jour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jour.component.html',
  styleUrls: ['./jour.component.scss']
})
export class JourComponent implements OnInit {

  emploiForm!: FormGroup;

  emplois: Emploidutemps[] = [];
  emploisParClasse: { classe: string; emplois: Emploidutemps[] }[] = [];

  annees: Anneeuv[] = [];
  enseignants: Enseignant[] = [];
  enseignes: Enseigner[] = [];

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private anneeService: AnneeuvService,
    private enseignantService: EnseignantService,
    private enseignerService: EnseignerService
  ) { }

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadAnnees();
    this.loadEnseignants();
    this.loadEnseignes();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error('Erreur chargement années', err)
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getAll().subscribe({
      next: data => this.enseignants = data,
      error: err => console.error('Erreur chargement enseignants', err)
    });
  }

  loadEnseignes(): void {
    this.enseignerService.getAll().subscribe({
      next: data => this.enseignes = data,
      error: err => console.error('Erreur chargement matières', err)
    });
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) return;

    const { jour, anneeuv } = this.emploiForm.value;

    this.emploiService.getAll().subscribe({
      next: data => {
        this.emplois = data
          .filter(e => e.jour === jour && e.anneeuv?.id == anneeuv)
          .map(e => ({
            ...e,
            nbreheure: this.calcHeures(e.heuredebut, e.heurefin)
          }));

        this.groupByClasse();
      },
      error: err => console.error('Erreur chargement emplois', err)
    });
  }

  private calcHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;

    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);

    let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (minutes < 0) minutes = 0;

    return Math.round((minutes / 60) * 100) / 100; // arrondi à 2 décimales
  }

  private groupByClasse(): void {
    const map = new Map<string, Emploidutemps[]>();

    this.emplois.forEach(e => {
      const classeNom = e.classe?.nom || 'Non défini';
      if (!map.has(classeNom)) map.set(classeNom, []);
      map.get(classeNom)!.push(e);
    });

    this.emploisParClasse = Array.from(map.entries())
      .map(([classe, emplois]) => ({ classe, emplois }));
  }

  printEmploi(): void {
    const printContent = document.getElementById('emploiPrint');
    if (!printContent) return;

    const newWin = window.open('', '_blank');
    if (!newWin) return;

    newWin.document.write('<html><head><title>Emploi du temps</title>');
    newWin.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
    newWin.document.write('</head><body>');
    newWin.document.write(printContent.innerHTML);
    newWin.document.write('</body></html>');
    newWin.document.close();
    newWin.print();
  }
}
