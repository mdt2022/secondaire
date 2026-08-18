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
  const nomAnnee = this.annees.find(a => a.id === this.selectedAnnee)?.nom || ''; 
  const nomPeriode = this.periodes.find(p => p.id === this.selectedPeriode)?.libelle || ''; 
  const nomClasse = this.classes.find(c => c.id === this.selectedClasse)?.nom || ''; 

  // Chargement du logo
  await new Promise<void>((resolve) => { 
    const img = new Image(); 
    img.src = logoUrl; 
    img.onload = () => { 
      doc.addImage(img, 'PNG', 15, 15, 25, 25); 
      resolve(); 
    }; 
    img.onerror = () => resolve(); // Évite le blocage si l'image ne charge pas
  }); 

  const maxWidth = 155; 
  doc.setFont('times', 'bold'); 
  doc.setFontSize(18); // Légère réduction pour gagner de l'espace en haut
  
  const descLignes = doc.splitTextToSize(descriptionEcole.toUpperCase(), maxWidth); 
  doc.text(descLignes, 110, 20, { align: 'center' }); 

  const descriptionHeight = descLignes.length * 6; 
  const pointilleY = 20 + descriptionHeight; 
  
  doc.setFont('times', 'normal'); 
  doc.setFontSize(9); 
  doc.text('......................................................', 105, pointilleY, { align: 'center' }); 

  const adresseAjustee = doc.splitTextToSize(adresseEcole, maxWidth); 
  doc.text(adresseAjustee, 105, pointilleY + 5, { align: 'center' }); 

  doc.setFont('times', 'bold'); 
  doc.setFontSize(15); 
  doc.text(`BULLETIN DE LA ${nomPeriode}`, 105, 42, { align: 'center' }); 

  doc.setFont('times', 'normal'); 
  doc.setFontSize(11); 
  doc.text(`Année Scolaire : ${nomAnnee}`, 105, 48, { align: 'center' }); 

  let y = 56; 
  doc.setFontSize(11); 
  doc.text(`Nom : ${this.bulletin.eleve.nom}`, 20, y); y += 5; 
  doc.text(`Prénom : ${this.bulletin.eleve.prenom}`, 20, y); y += 5; 
  doc.text(`Classe : ${nomClasse}`, 20, y); y += 6; 

  const rows = this.bulletin.notes.map((n: any) => [ 
    n.matiere.libelle, 
    n.noteClasse?.toFixed(2) ?? '', 
    n.noteCompo?.toFixed(2) ?? '', 
    n.mg?.toFixed(2) ?? '', 
    n.matiere.coefficient, 
    n.mgc?.toFixed(2) ?? '', 
    n.mention 
  ]); 

  // Génération du tableau avec padding réduit
  autoTable(doc, { 
    startY: y, 
    head: [['MATIERES', 'MOY CLASSE', 'MOY COMPO', 'MOY G.', 'COEFF.', 'MOY COEFF', 'MENTION']], 
    body: rows, 
    theme: 'grid', 
    styles: { 
      font: 'times', 
      fontSize: 10, // Réduit de 12 à 10 pour compacter le tableau
      halign: 'center', 
      lineColor:[0,0,0], 
      lineWidth: 0.1, 
      cellPadding: 2 // Réduit l'espace interne des cellules
    }, 
    headStyles: { fillColor:[230,230,230], textColor: 0, fontStyle: 'bold' }, 
    columnStyles: { 0: { halign: 'left', cellWidth: 55 } } 
  }); 

  let finalY = (doc as any).lastAutoTable.finalY + 8; 
  const hauteurRequiseConclusion = 60; // Espace nécessaire pour les totaux et les signatures

  // GESTION DU DEBORDEMENT : Si l'espace restant est insuffisant, on crée une nouvelle page
  if (finalY + hauteurRequiseConclusion > 270) {
    doc.addPage();
    finalY = 20; // Réinitialise la hauteur sur la nouvelle page
  }

  // Bloc des résultats
  doc.setFont('times', 'bold');
  doc.setFontSize(11); 
  doc.text(`TOTAL : ${this.bulletin.total?.toFixed(2)}`, 20, finalY); 
  doc.text(`Moyenne : ${this.bulletin.moyg?.toFixed(2)}`, 20, finalY + 5); 
  
  doc.setFont('times', 'normal');
  doc.text(`Observation : ${this.bulletin.observation}`, 20, finalY + 10); 
  
  let offsetElements = 15;
  if (this.bulletin.moy1er != null) {
    doc.text(`Moy. du 1er : ${this.bulletin.moy1er.toFixed(2)}`, 20, finalY + offsetElements); 
    offsetElements += 5;
  } 
  if (this.bulletin.rang != null) {
    doc.text(`Rang : ${this.bulletin.rang}`, 20, finalY + offsetElements); 
  } 

  // Bloc de signature
  const signY = finalY + 15; 
  doc.text(`Fait, le _________________`, 140, signY); 
  doc.setFont('times', 'bold');
  doc.text("Le Proviseur", 150, signY + 30); 

  // Pied de page (appliqué sur toutes les pages générées)
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8); 
    doc.setFont('times', 'italic'); 
    const footerLignes = adresseEcole.split('\n'); 
    footerLignes.forEach((line: string, index: number) => { 
      doc.text(line, 105, 285 + index * 4, { align: 'center' }); 
    }); 
  }

  doc.save(`bulletin_${this.bulletin.eleve.nom}_${this.bulletin.eleve.prenom}.pdf`); 
}
}
