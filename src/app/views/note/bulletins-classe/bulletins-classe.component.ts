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

      doc.addImage(img, 'PNG', 15, y, 35, 35);

      doc.setFontSize(9);
      doc.setFont('times', 'bold');
      doc.text(descriptionEcole.toUpperCase(), 105, y + 8, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont('times', 'normal');
      doc.text('......................................................', 105, y + 13, { align: 'center' });

      doc.text(adresseEcole, 105, y + 18, { align: 'center' });

      y += 40;

      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text(`BULLETIN DE LA ${nomPeriode}`, 105, y, { align: 'center' });

      y += 6;

      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.text(`Année Scolaire : ${nomAnnee}`, 105, y, { align: 'center' });

      y += 12;

      doc.setFontSize(11);
      doc.text(`Nom : ${eleve.nom || ''}`, 20, y);
      y += 6;

      doc.text(`Prénom : ${eleve.prenom || ''}`, 20, y);
      y += 6;

      doc.text(`Classe : ${nomClasse}`, 20, y);
      y += 10;

      const rows = notes.map((n: any) => [
  n.matiere?.libelle ?? '',
  Number(n.noteClasse ?? 0).toFixed(2),
  Number(n.noteCompo ?? 0).toFixed(2),
  Number(n.mg ?? 0).toFixed(2),
  n.matiere?.coefficient ?? '',
  Number(n.mgc ?? 0).toFixed(2),
  n.mention ?? ''
]);
      autoTable(doc, {
        startY: y,
        head: [['MATIERES','MOY CLASSE','MOY COMPO','MOY G','COEFF.','MOY COEFF','Mention']],
        body: rows,
        theme: 'grid',
        styles: {
          font: 'times',
          fontSize: 9,
          lineColor: [0,0,0],
          lineWidth: 0.2,
          halign: 'center'
        },
        headStyles: {
          fillColor: [255,255,255],
          textColor: 0,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 50 }
        }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      const moyennePremier = this.moyennes.length
        ? Number(this.moyennes[0].moyg ?? 0).toFixed(2)
        : '0.00';

      autoTable(doc, {
        startY: finalY,
        margin: { left: 20 },
        tableWidth: 80,
        theme: 'grid',
        styles: {
          font: 'times',
          fontSize: 10,
          lineColor: [0,0,0],
          lineWidth: 0.2
        },
        headStyles: {
          fillColor: [230,230,230]
        },
        body: [
  ['TOTAL', Number(eleveData.total ?? 0).toFixed(2)],
  ['Moyenne', Number(eleveData.moyg ?? 0).toFixed(2)],
  ['Observation', eleveData.observation ?? ''],
  ['Moy. du 1er', Number(this.moyennes.length ? this.moyennes[0].moyg : 0).toFixed(2)],
  ['Rang', `${eleveData.rang} / ${this.moyennes.length}`]
]
      });

      const signY = finalY + 30;

      doc.text(`Fait, le __________________`, 140, signY);
      doc.text("Le Proviseur", 160, signY + 15);

      doc.setFontSize(8);
      doc.setFont('times', 'italic');
      doc.text(adresseEcole, 105, 285, { align: 'center' });

      if (index < this.moyennes.length - 1) {
        doc.addPage();
      }

    });

    doc.save("Bulletins.pdf");
  };
}


  imprimerListePDF(): void {

  if (!this.moyennes.length) return;

  const doc = new jsPDF('l', 'mm', 'a4'); // paysage pour grande liste

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
