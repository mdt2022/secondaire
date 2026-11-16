import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AnneeuvService } from '../../../service/anneeuv.service';

import { Emploidutemps } from '../../../model/emploidutemps';
import { Anneeuv } from '../../../model/anneeuv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jour.component.html',
  styleUrls: ['./jour.component.scss']
})
export class JourComponent implements OnInit {

  emploiForm!: FormGroup;
  idEcole: number | null = null;
  emplois: Emploidutemps[] = [];
  emploisParClasse: { classe: string; emplois: Emploidutemps[] }[] = [];
  rechercheEffectuee = false;
  chargement = false;
  erreurChargement = '';
  annees: Anneeuv[] = [];

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private anneeService: AnneeuvService
  ) { }

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadAnnees();
    this.getEcoleFromUser();
  }
 // ---------------- Récupération école ----------------
  getEcoleFromUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const ecoleId = Number(
      user?.parametre?.ecole?.idEcole ??
      user?.administrateur?.ecole?.idEcole
    );
    this.idEcole = Number.isSafeInteger(ecoleId) && ecoleId > 0 ? ecoleId : null;
    if (!this.idEcole) console.error('ID école introuvable');
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error('Erreur chargement années', err)
    });
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      return;
    }

    this.rechercheEffectuee = false;
    this.erreurChargement = '';
    this.emplois = [];
    this.emploisParClasse = [];

    if (!this.idEcole) {
      this.erreurChargement = 'Impossible de rechercher les emplois : l’école de l’utilisateur est introuvable.';
      return;
    }

    const { jour, anneeuv } = this.emploiForm.value;

    this.chargement = true;

    this.emploiService.parJour(jour, anneeuv, this.idEcole).subscribe({
      next: data => {
        this.emplois = data
          .filter(e =>
            e.jour === jour &&
            Number(e.anneeuv?.id) === Number(anneeuv) &&
            Number(e.ecole?.idEcole) === this.idEcole
          )
          .map(e => ({
            ...e,
            // nbreheure: this.calcHeures(e.heuredebut, e.heurefin)
          }));

        this.groupByClasse();
        this.rechercheEffectuee = true;
        this.chargement = false;
      },
      error: err => {
        console.error('Erreur chargement emplois', err);
        this.erreurChargement = 'Le chargement des emplois du temps a échoué. Veuillez réessayer.';
        this.chargement = false;
      }
    });
  }

  // private calcHeures(debut: string, fin: string): number {
  //   if (!debut || !fin) return 0;

  //   const parseMinutes = (heure: string): number | null => {
  //     const match = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/.exec(heure);
  //     if (!match) return null;

  //     const heures = Number(match[1]);
  //     if (heures > 23) return null;

  //     return heures * 60 + Number(match[2]);
  //   };

  //   const minutesDebut = parseMinutes(debut);
  //   const minutesFin = parseMinutes(fin);
  //   if (minutesDebut === null || minutesFin === null) return 0;

  //   let minutes = minutesFin - minutesDebut;
  //   if (minutes < 0) minutes = 0;

  //   return Math.round((minutes / 60) * 100) / 100;
  // }

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

  /**********impression */

async printEmploi(): Promise<void> {
  if (this.emplois.length === 0) {
    Swal.fire(
      'Aucune donnée',
      'Aucun emploi du temps à imprimer.',
      'info'
    );
    return;
  }

  const { jour, anneeuv } = this.emploiForm.value;

  const anneeNom = this.annees.find(
    annee => annee.id == anneeuv
  )?.nom ?? '';

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  const ecole =
    user?.administrateur?.ecole ??
    user?.parametre?.ecole;

  const nomEcole =
    ecole?.nomEcole ??
    ecole?.descriptionEcole ??
    '';

  const descriptionEcole =
    ecole?.descriptionEcole ?? nomEcole;

  const adresseEcole =
    ecole?.adresseEcole ?? '';

  // DONNÉES DU TABLEAU
  // ÉTABLISSEMENT et JOUR supprimés
  const rows = this.emplois.map((emploi, index) => [
    String(index + 1),

    `${emploi.professeur?.prenom ?? ''} ${emploi.professeur?.nom ?? ''}`.trim(),

    emploi.classe?.nom ?? '',

    `${emploi.heuredebut} - ${emploi.heurefin}`,

    emploi.matiere?.libelle ?? '',

    (Number(emploi.matiere?.horaire) || 0).toLocaleString(
      'fr-FR',
      { maximumFractionDigits: 2 }
    ),

    ''
  ]);

  const doc = new jsPDF('p', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logo = await this.loadLogoForPdf();

  const dateImpression = new Date().toLocaleDateString('fr-FR');

  // EN-TÊTE
  doc.setFont('times', 'bold');
  doc.setFontSize(11);

  const descriptionLignes = doc.splitTextToSize(
    descriptionEcole.trim().toUpperCase(),
    pageWidth - 37
  );

  const titreY = 10 + descriptionLignes.length * 5 + 3;
  const informationsY = titreY + 6;
  const debutTableauY = informationsY + 9;

  // TABLEAU
  autoTable(doc, {
    startY: debutTableauY,

    head: [[
      'N°',
      'PRÉNOMS ET NOM',
      'CLASSE',
      'HEURES',
      'MATIÈRE',
      'H',
      'ÉMARGEMENT'
    ]],

    body: rows,

    theme: 'grid',

    margin: {
      top: debutTableauY,
      bottom: 18,
      left: 8,
      right: 8
    },

    
styles: {
  font: 'times',
  fontSize: 11,
  cellPadding: 0.8,
  minCellHeight: 7,
  lineColor: [150, 150, 150],
  lineWidth: 0.2,
  textColor: [20, 20, 20],
  valign: 'middle',
  overflow: 'linebreak'
},

headStyles: {
  fillColor: [31, 78, 121],
  textColor: [255, 255, 255],
  fontStyle: 'bold',
  lineColor: [31, 78, 121],
  lineWidth: 0.3,
  fontSize: 10,
  cellPadding: 0.8,
  minCellHeight: 8,
  halign: 'center',
  valign: 'middle'
},

alternateRowStyles: {
  fillColor: [242, 246, 250]
},

columnStyles: {
  0: {
    cellWidth: 9,
    halign: 'center'
  },
  1: {
    cellWidth: 43
  },
  2: {
    cellWidth: 22,
    halign: 'center'
  },
  3: {
    cellWidth: 27,
    halign: 'center'
  },
  4: {
    cellWidth: 42
  },
  5: {
    cellWidth: 12,
    halign: 'center'
  },
  6: {
    cellWidth: 'auto',
    halign: 'center'
  }
},


    didDrawPage: () => {

      // LOGO
      if (logo) {
        doc.addImage(logo, 'PNG', 5, 6, 25, 25);
      }

      // NOM DE L'ÉTABLISSEMENT
      doc.setFont('times', 'bold');
      doc.setFontSize(11);

      doc.text(
        descriptionLignes,
        pageWidth / 2 + 12.5,
        10,
        {
          align: 'center',
          maxWidth: pageWidth - 40
        }
      );

      // TITRE
      doc.setFontSize(13);

      doc.text(
        "FICHE D'ÉMARGEMENT",
        pageWidth / 2,
        titreY,
        { align: 'center' }
      );

      // INFORMATIONS SCOLAIRES
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      doc.text(
        `Jour : ${jour}    Année scolaire : ${anneeNom}`,
        pageWidth / 2,
        informationsY,
        { align: 'center' }
      );
    }
  });

  // PIED DE PAGE
  const totalPages = doc.internal.pages.length - 1;

  for (let page = 1; page <= totalPages; page++) {

    doc.setPage(page);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.2);

    // LIGNE DE SÉPARATION
    doc.line(
      8,
      pageHeight - 13,
      pageWidth - 8,
      pageHeight - 13
    );

    // ADRESSE
    const adresseLignes = doc.splitTextToSize(
      adresseEcole.trim(),
      65
    );

    if (adresseLignes.length) {
      doc.text(
        adresseLignes,
        8,
        pageHeight - 8 - (adresseLignes.length - 1) * 3
      );
    }

    // DATE D'IMPRESSION
    doc.text(
      `Imprimé le : ${dateImpression}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );

    // NUMÉRO DE PAGE
    doc.text(
      `Page ${page} / ${totalPages}`,
      pageWidth - 8,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  // NOM DU FICHIER
  const jourFichier = String(jour || 'jour')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

  const anneeFichier = String(anneeNom || 'annee')
    .replace(/[^a-zA-Z0-9-]/g, '-');

  doc.save(
    `fiche-emargement-${jourFichier}-${anneeFichier}.pdf`
  );
}


/*****fin de impression */

  private loadLogoForPdf(): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
      const logo = new Image();
      logo.onload = () => resolve(logo);
      logo.onerror = () => resolve(null);
      logo.src = 'assets/logo.png';
    });
  }
}
