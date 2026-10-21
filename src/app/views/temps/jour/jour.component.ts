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
            nbreheure: this.calcHeures(e.heuredebut, e.heurefin)
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

  private calcHeures(debut: string, fin: string): number {
    if (!debut || !fin) return 0;

    const parseMinutes = (heure: string): number | null => {
      const match = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/.exec(heure);
      if (!match) return null;

      const heures = Number(match[1]);
      if (heures > 23) return null;

      return heures * 60 + Number(match[2]);
    };

    const minutesDebut = parseMinutes(debut);
    const minutesFin = parseMinutes(fin);
    if (minutesDebut === null || minutesFin === null) return 0;

    let minutes = minutesFin - minutesDebut;
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

    this.emploisParClasse = Array.from(map.entries())
      .map(([classe, emplois]) => ({ classe, emplois }));
  }

  /**********impression */
  async printEmploi(): Promise<void> {
    if (this.emplois.length === 0) {
      Swal.fire('Aucune donnée', 'Aucun emploi du temps à imprimer.', 'info');
      return;
    }

    const { jour, anneeuv } = this.emploiForm.value;
    const anneeNom = this.annees.find(annee => annee.id == anneeuv)?.nom ?? '';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const ecole = user?.administrateur?.ecole ?? user?.parametre?.ecole;
    const nomEcole = ecole?.nomEcole ?? ecole?.descriptionEcole ?? '';
    const descriptionEcole = ecole?.descriptionEcole ?? nomEcole;
    const adresseEcole = ecole?.adresseEcole ?? '';
    const rows = this.emplois.map((emploi, index) => [
        String(index + 1),
        `${emploi.professeur?.prenom ?? ''} ${emploi.professeur?.nom ?? ''}`.trim(),
        nomEcole,
        jour,
        emploi.classe?.nom ?? '',
        `${emploi.heuredebut} - ${emploi.heurefin}`,
        emploi.matiere?.libelle ?? '',
        (Number(emploi.nbreheure) || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
        ''
    ]);

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = await this.loadLogoForPdf();
    const dateImpression = new Date().toLocaleDateString('fr-FR');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    const descriptionLignes = doc.splitTextToSize(descriptionEcole.trim().toUpperCase(), pageWidth - 37);
    const titreY = 10 + descriptionLignes.length * 5 + 3;
    const informationsY = titreY + 6;
    const debutTableauY = informationsY + 7;

    autoTable(doc, {
      startY: debutTableauY,
      head: [['N°', 'PRÉNOMS ET NOM', 'ÉTABLIS', 'Jour de la SEM', 'Classe', 'HEURES', 'MATIÈRE', 'NBRE', 'ÉMARGEMENT']],
      body: rows,
      theme: 'grid',
      margin: { top: debutTableauY, bottom: 16, left: 5, right: 5 },
      styles: {
        font: 'times',
        fontSize: 9,
        cellPadding: 1.4,
        minCellHeight: 8.5,
        lineColor: [40, 40, 40],
        lineWidth: 0.2,
        textColor: [20, 20, 20],
        valign: 'middle',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [30, 30, 30],
        lineWidth: 0.3,
        fontSize: 9,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        1: { cellWidth: 38 },
        2: { cellWidth: 19, halign: 'center' },
        3: { cellWidth: 19, halign: 'center' },
        4: { cellWidth: 14, halign: 'center' },
        5: { cellWidth: 23, halign: 'center' },
        6: { cellWidth: 34 },
        7: { cellWidth: 10, halign: 'center' },
        8: { cellWidth: 36 }
      },
      didDrawPage: () => {
        if (logo) doc.addImage(logo, 'PNG', 5, 6, 25, 25);
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.text(descriptionLignes, pageWidth / 2 + 12.5, 10, {
          align: 'center',
          maxWidth: pageWidth - 40
        });
        doc.setFontSize(13);
        doc.text("FICHE D'EMARGEMENT", pageWidth / 2, titreY, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Jour : ${jour}    Année scolaire : ${anneeNom}`, pageWidth / 2, informationsY, { align: 'center' });
      }
    });

    const totalPages = doc.internal.pages.length - 1;
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setDrawColor(120, 120, 120);
      doc.setLineWidth(0.2);
      doc.line(8, pageHeight - 13, pageWidth - 8, pageHeight - 13);
      const adresseLignes = doc.splitTextToSize(adresseEcole.trim(), 65);
      if (adresseLignes.length) {
        doc.text(adresseLignes, 8, pageHeight - 8 - (adresseLignes.length - 1) * 3);
      }
      doc.text(`Imprimé le : ${dateImpression}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
      doc.text(`Page ${page} / ${totalPages}`, pageWidth - 8, pageHeight - 7, { align: 'right' });
    }

    const jourFichier = String(jour || 'jour').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const anneeFichier = String(anneeNom || 'annee').replace(/[^a-zA-Z0-9-]/g, '-');
    doc.save(`fiche-emargement-${jourFichier}-${anneeFichier}.pdf`);
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
