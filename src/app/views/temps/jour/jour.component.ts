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
  idEcole!: number;
  emplois: Emploidutemps[] = [];
  emploisParClasse: { classe: string; emplois: Emploidutemps[] }[] = [];
  rechercheEffectuee = false;

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
    this.getEcoleFromUser();
  }
 // ---------------- Récupération école ----------------
  getEcoleFromUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.idEcole =
      user?.parametre?.ecole?.idEcole ||
      user?.administrateur?.ecole?.idEcole;
    if (!this.idEcole) console.error('ID école introuvable', user);
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

    this.rechercheEffectuee = false;
    this.emploiService.parJour(jour,anneeuv,this.idEcole).subscribe({
      next: data => {
        this.emplois = data
          .filter(e => e.jour === jour && e.anneeuv?.id == anneeuv)
          .map(e => ({
            ...e,
            nbreheure: this.calcHeures(e.heuredebut, e.heurefin)
          }));

        this.groupByClasse();
        this.rechercheEffectuee = true;
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

  /**********impression */
  async printEmploi(): Promise<void> {
  if (this.emplois.length === 0) {
    Swal.fire('Aucune donnée', 'Aucun emploi du temps à imprimer.', 'info');
    return;
  }

  const { jour, anneeuv } = this.emploiForm.value;
  const anneeNom = this.annees.find(annee => annee.id == anneeuv)?.nom ?? '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const descriptionEcole = user?.administrateur?.ecole?.descriptionEcole ?? user?.parametre?.ecole?.descriptionEcole ?? '';

  const doc = new jsPDF('l', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logo = await this.loadLogoForPdf();

  if (logo) doc.addImage(logo, 'PNG', 15, 10, 25, 25);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  const descriptionLignes = doc.splitTextToSize(descriptionEcole.toUpperCase(), pageWidth - 75);
  doc.text(descriptionLignes, pageWidth / 2 + 10, 16, { align: 'center' });

  const titreY = Math.max(34, 16 + descriptionLignes.length * 8 + 5);
  doc.setFontSize(20);
  doc.text("FICHE D'EMARGEMENTS", pageWidth / 2, titreY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`Jour : ${jour}  Année scolaire : ${anneeNom}`, pageWidth / 2, titreY + 7, { align: 'center' });

  let positionY = titreY + 13;
  const dateImpression = new Date().toLocaleDateString('fr-FR');

  this.emploisParClasse.forEach((bloc, index) => {
    // Calcul strict : Hauteur d'une ligne moyenne (~8mm) + Entête (~10mm) + Titre de classe (~10mm)
    const tableHeightEstimated = 12 + (bloc.emplois.length * 8) + 10;

    // Si le tableau entier ne tient pas dans l'espace restant (en gardant 25mm de marge pour le footer)
    if (positionY + tableHeightEstimated > pageHeight - 25) {
      doc.addPage();
      positionY = 20; // Repositionnement propre en haut de la nouvelle page
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text(bloc.classe, 15, positionY + 6);

    const body = bloc.emplois.map(emploi => [
      `${emploi.professeur?.prenom ?? ''} ${emploi.professeur?.nom ?? ''}`.trim(),
      `${emploi.heuredebut} -- ${emploi.heurefin}`,
      emploi.matiere?.libelle ?? '',
      emploi.matiere?.coefficient ?? '',
      emploi.matiere?.horaire ?? '',
      emploi.nbreheure ?? '',
      ''
    ]);

    autoTable(doc, {
      startY: positionY + 11,
      head: [['Professeur', 'Horaires', 'Matière', 'Coefficient', 'Horaire h', 'Nombre d’heures', 'Emargement']],
      body,
      theme: 'grid',
      pageBreak: 'auto', // Permet la transition si une classe a énormément de lignes
      margin: { bottom: 30, left: 15, right: 15 }, // Marge basse augmentée pour sécuriser le bas de page
      styles: { fontSize: 12, cellPadding: 2, valign: 'middle' },
      headStyles: { fillColor: [40, 100, 180] },
      columnStyles: {
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' }
      }
    });

    // On récupère la fin réelle du tableau généré pour positionner le suivant
    positionY = (doc as any).lastAutoTable.finalY + 15;
  });

  // ==========================================
  // APPLICATION DU PIED DE PAGE SUR TOUTES LES PAGES
  // ==========================================
  const totalPages = doc.internal.pages.length - 1; // jsPDF indexe avec un élément vide à la fin
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); // On cible la page courante
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    // 1. Dessin de la description de l'école (parfaitement nettoyée et centrée)
    const texteEcoleNettoye = descriptionEcole.replace(/^\s+|\s+\$/g, ''); // Équivalent robuste à .trim()
    const lignesFooter = doc.splitTextToSize(texteEcoleNettoye, pageWidth - 100);
    doc.text(lignesFooter, pageWidth / 2, pageHeight - 14, { align: 'center' });
    
    // 2. Date d'impression en bas à gauche
    doc.text(`Imprimé le : ${dateImpression}`, 15, pageHeight - 8, { align: 'left' });
    
    // 3. Pagination à droite
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - 15, pageHeight - 8, { align: 'right' });
  }

  const jourFichier = String(jour || 'jour').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const anneeFichier = String(anneeNom || 'annee').replace(/[^a-zA-Z0-9-]/g, '-');
  doc.save(`emploi-du-temps-${jourFichier}-${anneeFichier}.pdf`);
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
