import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import autoTable from 'jspdf-autotable';

import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { PeriodeService } from '../../../service/periode.service';
import { NoteService } from '../../../service/note.service';

@Component({
  selector: 'app-bulletin-eleve',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bulletin-eleve.component.html',
  styleUrl: './bulletin-eleve.component.scss'
})
export class BulletinEleveComponent implements OnInit {

  annees: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  periodes: any[] = [];

  selectedAnnee: number | null = null;
  selectedClasse: number | null = null;
  selectedEleve: number | null = null;
  selectedPeriode: number | null = null;

  bulletin: any;

  constructor(
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private eleveService: EleveecoleService,
    private periodeService: PeriodeService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.anneeService.getAll().subscribe(r => this.annees = r);
    this.periodeService.getAll().subscribe(r => this.periodes = r);

    const ecoleId = JSON.parse(localStorage.getItem('user')!).administrateur.ecole.idEcole;
    this.classeService.getAllClasseParEcole(ecoleId).subscribe(r => this.classes = r);
  }

  chargerEleves() {
    if (this.selectedAnnee == null || this.selectedClasse == null) {
      console.warn("Année ou Classe non sélectionnée !");
      this.eleves = [];
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    const ecoleId = user.administrateur.ecole.idEcole;

    const body = [
      this.selectedAnnee.toString(),
      ecoleId.toString(),
      this.selectedClasse.toString()
    ];

    this.eleveService.getByClasseAndAnnee(body).subscribe({
      next: (res) => this.eleves = res,
      error: (err) => console.error("Erreur chargement élèves", err)
    });
  }

  afficherBulletin() {
    if (!this.selectedEleve || !this.selectedAnnee || !this.selectedClasse || !this.selectedPeriode) {
      console.warn("Tous les champs doivent être sélectionnés !");
      return;
    }

    const ecoleId = JSON.parse(localStorage.getItem('user')!).administrateur.ecole.idEcole;

    this.noteService.getBulletinEleve(
      this.selectedEleve,
      this.selectedAnnee,
      this.selectedPeriode,
      this.selectedClasse,
      ecoleId
    ).subscribe({
      next: r => this.bulletin = r,
      error: err => console.error("Erreur récupération bulletin", err)
    });
  }

async imprimer() {
  if (!this.bulletin) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const logoUrl = 'assets/logo.png';
  const user = JSON.parse(localStorage.getItem('user')!);
  const descriptionEcole = user.administrateur.ecole.descriptionEcole || '';
  const adresseEcole = user.administrateur.ecole.adresseEcole || '';

  const anneeObj = this.annees.find(a => a.id === this.selectedAnnee);
  const nomAnnee = anneeObj ? anneeObj.nom : '';

  const periodeObj = this.periodes.find(p => p.id === this.selectedPeriode);
  const nomPeriode = periodeObj ? periodeObj.libelle : '';

  const classeObj = this.classes.find(c => c.id === this.selectedClasse);
  const nomClasse = classeObj ? classeObj.nom : '';

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 15, 35, 35); 
      resolve();
    };
  });

  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.text(descriptionEcole.toUpperCase(), 105, 25, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text('......................................................', 105, 30, { align: 'center' });

  const adresseLignes = adresseEcole.split('\n');
  adresseLignes.forEach((line: string | string[], i: number) => {
    doc.text(line, 105, 35 + i * 5, { align: 'center' });
  });

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text(`BULLETIN DE LA ${nomPeriode}`, 105, 50, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.text(`Année Scolaire : ${nomAnnee}`, 105, 57, { align: 'center' });

  let y = 75;
  doc.setFontSize(10);
  doc.text(`Nom : ${this.bulletin.eleve.nom}`, 20, y);
  y += 6;
  doc.text(`Prénom : ${this.bulletin.eleve.prenom}`, 20, y);
  y += 6;
  doc.text(`Classe : ${nomClasse}`, 20, y);
  y += 10;

  const rows = this.bulletin.notes.map((n: any) => [
    n.matiere.libelle,
    n.noteClasse?.toFixed(2) ?? '',
    n.noteCompo?.toFixed(2) ?? '',
    n.mg?.toFixed(2) ?? '',
    n.matiere.coefficient,
    n.mgc?.toFixed(2) ?? '',
    n.mention
  ]);

  autoTable(doc, {
    startY: y,
    head: [['MATIERES', 'MOY CLASSE', 'MOY COMPO', 'MOY G.', 'COEFF.', 'MOY COEFF', 'MENTION']],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'times',
      fontSize: 9,
      halign: 'center',
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 0,
      fontStyle: 'bold'
    },
    columnStyles: { 0: { halign: 'left', cellWidth: 55 } }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 5;

  doc.setFontSize(10);
  doc.text(`TOTAL : ${this.bulletin.total?.toFixed(2)}`, 20, finalY);
  doc.text(`Moyenne : ${this.bulletin.moyg?.toFixed(2)}`, 20, finalY + 6);
  doc.text(`Observation : ${this.bulletin.observation}`, 20, finalY + 12);

  if (this.bulletin.moy1er != null) doc.text(`Moy. du 1er : ${this.bulletin.moy1er.toFixed(2)}`, 20, finalY + 18);
  if (this.bulletin.rang != null) doc.text(`Rang : ${this.bulletin.rang}`, 20, finalY + 24);

  const signY = finalY + 40;
  doc.text(`Fait, le _________________`, 140, signY);
  doc.text("Le Proviseur", 160, signY + 15);

  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  const footerLignes = adresseEcole.split('\n');
  footerLignes.forEach((line: string | string[], i: number) => {
    doc.text(line, 105, 285 + i * 4, { align: 'center' });
  });

  doc.save(`bulletin_${this.bulletin.eleve.nom}_${this.bulletin.eleve.prenom}.pdf`);
}



}
