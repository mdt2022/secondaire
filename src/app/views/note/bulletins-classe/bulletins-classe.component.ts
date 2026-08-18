import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { PeriodeService } from '../../../service/periode.service';
import { NoteService } from '../../../service/note.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulletins-classe',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bulletins-classe.component.html',
  styleUrl: './bulletins-classe.component.scss'
})


export class BulletinsClasseComponent implements OnInit {


  mode: 'form' | 'bulletin' | 'liste' = 'form';

  etablissement = '';

  periodes: any[] = [];
  annees: any[] = [];
  classes: any[] = [];

  selectedPeriode: number | null = null;
  selectedAnnee: number | null = null;
  selectedClasse: number | null = null;

  moyennes: any[] = [];

  constructor(
    private periodeService: PeriodeService,
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) return;
      const user = JSON.parse(localStorage.getItem('user')!);
      this.etablissement = user.administrateur.ecole.nomEcole;
      this.authService.getAdminData()?.administrateur?.ecole?.nom ?? '';

    this.periodeService.getAll().subscribe(res => this.periodes = res);
    this.anneeService.getAll().subscribe(res => this.annees = res);
    this.classeService.getAllClasseParEcole(ecoleId)
      .subscribe(res => this.classes = res);
  }

chargerBulletin(): void {

  const ecoleId = this.authService.getEcoleId();

  if (!this.selectedPeriode || !this.selectedAnnee || !this.selectedClasse || !ecoleId) {

    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez sélectionner la période, l’année et la classe.',
      confirmButtonColor: '#3085d6'
    });

    return;
  }

  this.noteService.getBulletinClasse(
    ecoleId,
    this.selectedClasse,
    this.selectedAnnee,
    this.selectedPeriode
  ).subscribe(res => {

    if (!res || res.length === 0) {

      Swal.fire({
        icon: 'info',
        title: 'Aucun bulletin',
        text: 'Aucun bulletin trouvé pour les critères sélectionnés.',
        confirmButtonColor: '#3085d6'
      });

      return;
    }

    res.sort((a: any, b: any) => (b.moyg || 0) - (a.moyg || 0));

    // Attribution du rang
    res.forEach((e: any, i: number) => e.rang = i + 1);

    this.moyennes = res;
    this.mode = 'bulletin';

  }, error => {

    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Impossible de charger les bulletins.',
      confirmButtonColor: '#d33'
    });

  });
}


  retourForm(): void {
    this.mode = 'form';
  }

imprimerPDF(): void {
  if (!this.moyennes.length) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const logoUrl = 'assets/logo.png';

  const user = JSON.parse(localStorage.getItem('user')!);
  const descriptionEcole = user.administrateur.ecole.descriptionEcole || '';
  const adresseEcole = user.administrateur.ecole.adresseEcole || '';

  const img = new Image();
  img.src = logoUrl;

  img.onload = () => {
    const anneeObj = this.annees.find(a => a.id == this.selectedAnnee);
    const nomAnnee = anneeObj ? anneeObj.nom : '';

    const periodeObj = this.periodes.find(p => p.id == this.selectedPeriode);
    const nomPeriode = periodeObj ? periodeObj.libelle : '';

    const classeObj = this.classes.find(c => c.id == this.selectedClasse);
    const nomClasse = classeObj ? classeObj.nom : '';

    this.moyennes.forEach((eleveData, index) => {
      let y = 15;
      const eleve = eleveData.eleve ?? {};
      const notes = eleveData.notes ?? [];

      doc.setFont('times', 'normal');
      doc.addImage(img, 'PNG', 15, y, 25, 25);
      
      const maxWidth = 155; 
      doc.setFontSize(18); // Légèrement réduit (20 -> 18) pour gagner de la place en haut
      doc.setFont('times', 'bold');
      
      const descLignes = doc.splitTextToSize(descriptionEcole.toUpperCase(), maxWidth);
      doc.text(descLignes, 110, y + 4, { align: 'center' });

      const descriptionHeight = descLignes.length * 5; 
      const pointilleY = 18 + descriptionHeight;
      doc.setFontSize(9);
      doc.setFont('times', 'normal');
      doc.text('......................................................', 105, pointilleY, { align: 'center' });

      const adresseAjustee = doc.splitTextToSize(adresseEcole, maxWidth);
      doc.text(adresseAjustee, 105, pointilleY + 5, { align: 'center' });
      
      y = pointilleY + 5 + (adresseAjustee.length * 4) + 5;

      doc.setFontSize(14); // Légèrement compacté (12 -> 14 pour le titre principal)
      doc.setFont('times', 'bold');
      doc.text(`BULLETIN DE LA ${nomPeriode}`, 105, y, { align: 'center' });

      y += 6;
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.text(`Année Scolaire : ${nomAnnee}`, 105, y, { align: 'center' });

      y += 6;
      doc.setFontSize(11); // Police uniforme pour les infos de l'élève
      doc.text(`Nom : ${eleve.nom || ''}`, 20, y);
      y += 5;
      doc.text(`Prénom : ${eleve.prenom || ''}`, 20, y);
      y += 5;
      doc.text(`Classe : ${nomClasse}`, 20, y);
      y += 5;

      const rows = notes.map((n: any) => [
        n.matiere?.libelle ?? '',
        Number(n.noteClasse ?? 0).toFixed(2),
        Number(n.noteCompo ?? 0).toFixed(2),
        Number(n.mg ?? 0).toFixed(2),
        n.matiere?.coefficient ?? '',
        Number(n.mgc ?? 0).toFixed(2),
        n.mention ?? ''
      ]);

      // 1. Optimisation du tableau principal des matières
      autoTable(doc, {
        startY: y,
        head: [['MATIERES','MOY CLASSE','MOY COMPO','MOY G','COEFF.','MOY COEFF','Mention']],
        body: rows,
        theme: 'grid',
        styles: {
          font: 'times',
          fontSize: 10, // Réduit de 12 à 10 pour compacter globalement la hauteur
          lineColor:[0,0,0],
          lineWidth: 0.1,
          halign: 'center',
          cellPadding: 1.5 // Réduction de l'espace interne pour économiser des lignes
        },
        headStyles: {
          fillColor:[230,230,230], // Gris très clair pour le rendu propre
          textColor: 0,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 50 }
        }
      });

      let finalY = (doc as any).lastAutoTable.finalY + 4;

      // 2. Gestion stricte anti-débordement avant d'afficher le bloc de fin
      // Si l'espace restant sur la page est insuffisant pour accueillir les totaux + signatures (besoin d'environ 65mm)
      if (finalY + 65 > 275) {
        doc.addPage();
        finalY = 20; // Réinitialise sur la nouvelle page uniquement pour ce cas extrême
      }

      // 3. Rendu compact du tableau de résumé
      autoTable(doc, {
        startY: finalY,
        tableWidth: 80,
        theme: 'grid',
        styles: {
          font: 'times',
          fontSize: 10, // Cohérence à 10 avec le tableau principal
          lineColor:[0,0,0],
          lineWidth: 0.1,
          cellPadding: 1.5
        },
        body: [
          ['TOTAL', Number(eleveData.total ?? 0).toFixed(2)],
          ['Moyenne', Number(eleveData.moyg ?? 0).toFixed(2)],
          ['Observation', eleveData.observation ?? ''],
          ['Moy. du 1er', Number(this.moyennes.length ? this.moyennes[0].moyg : 0).toFixed(2)],
          ['Rang', `${eleveData.rang} / ${this.moyennes.length}`]
        ]
      });

      // 4. Calcul dynamique pour la signature juste en dessous du bloc résumé
      const endOfSummaryTable = (doc as any).lastAutoTable.finalY;
      const signY = endOfSummaryTable + 10; 

      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.text(`Fait, le __________________`, 140, signY);
      doc.setFont('times', 'bold');
      doc.text("Le Proviseur", 155, signY + 30); // Rapprochement vertical pour éviter le hors-page

      // 5. Rendu propre du pied de page
      doc.setFontSize(8);
      doc.setFont('times', 'italic');
      
      // Force l'affichage dynamique multi-ligne si l'adresse de l'école comporte des sauts de ligne
      const footerLignes = adresseEcole.split('\n');
      footerLignes.forEach((line: string, indexLine: number) => {
        doc.text(line, 105, 283 + (indexLine * 3.5), { align: 'center' });
      });

      // Ajout d'une nouvelle page uniquement s'il reste des élèves à traiter
      if (index < this.moyennes.length - 1) {
        doc.addPage();
      }
    });

    doc.save("Bulletins.pdf");
  };
}

imprimerListePDF(): void {
  if (!this.moyennes.length) return;

  const doc = new jsPDF('l', 'mm', 'a4'); 

  doc.setFontSize(14);
  doc.text(`LISTE GÉNÉRALE DES MOYENNES`, 14, 15);

  doc.setFontSize(11);
  doc.text(this.etablissement, 14, 22);

  const body = this.moyennes.map((eleve: any, index: number) => [
    index + 1,
    eleve.eleve?.matricule ?? '',
    eleve.eleve?.nom ?? '',
    eleve.eleve?.prenom ?? '',
    Number(eleve.moyg ?? 0).toFixed(2),
    eleve.observation ?? '',
    eleve.rang ?? ''
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['#','Matricule','Nom','Prénom','Moyenne','Observation','Rang']],
    body: body,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { halign: 'center' },
    bodyStyles: { halign: 'center' }
  });

  doc.save(`Liste_Moyennes_${Date.now()}.pdf`);
}


}
