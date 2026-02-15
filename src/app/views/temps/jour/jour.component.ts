import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
  loading: boolean = false;


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

    this.loading = true;

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

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  private calcHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (minutes < 0) minutes = 0;
    return Math.round((minutes / 60) * 100) / 100;
  }

  private groupByClasse(): void {
    const map = new Map<string, Emploidutemps[]>();
    this.emplois.forEach(e => {
      const classeNom = e.classe?.nom || 'Non défini';
      if (!map.has(classeNom)) map.set(classeNom, []);
      map.get(classeNom)!.push(e);
    });
    this.emploisParClasse = Array.from(map.entries()).map(([classe, emplois]) => ({ classe, emplois }));
  }

  generatePDF(): void {

    const doc = new jsPDF();

    this.emploisParClasse.forEach((bloc, index) => {

      if (index > 0) doc.addPage();

      doc.setFontSize(14);

      doc.text(`Emploi du temps - ${bloc.classe}`, 14, 15);

      const body = bloc.emplois.map(e => [
        `${e.professeur.prenom} ${e.professeur.nom}`,
        `${e.heuredebut} -- ${e.heurefin}`,
        e.matiere.libelle,
        e.matiere.coefficient,
        e.matiere.horaire,
        e.nbreheure,
        ''
      ]);

      autoTable(doc, {
        head: [[
          'Professeur',
          'Horaires',
          'Matière',
          'Coefficient',
          'Horaire h',
          'Nombre d’heures',
          'Emargement'
        ]],

        body: body,

        startY: 25,

        theme: 'grid',

        headStyles: {
          fillColor: [224, 224, 224],
          textColor: 0
        },

        styles: {
          fontSize: 9
        }

      });

    });

    doc.save('emploi_du_temps.pdf');

  }

}
