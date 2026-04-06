import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../../service/note.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { PeriodeService } from '../../../service/periode.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relever',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relever.component.html',
  styleUrl: './relever.component.scss'
})
export class ReleverComponent implements OnInit {
etablissement = '';
etabliss = '';
  ecoleId!: number;

  classeecoleId!: number;
  periodeId!: number;
  anneeId!: number;

  classes: any[] = [];
  periodes: any[] = [];
  annees: any[] = [];
  eleves: any[] = [];

  loading = false;

  constructor(
    private noteService: NoteService,
    private classeService: ClasseEcoleService,
    private periodeService: PeriodeService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user')!);

    this.ecoleId = user.administrateur.ecole.idEcole;
    this.etablissement = user.administrateur.ecole.nomEcole;
    this.etabliss = user.administrateur.ecole.descriptionEcole;

    this.classeService.getAllClasseParEcole(this.ecoleId)
      .subscribe(data => this.classes = data);

    this.periodeService.getAll()
      .subscribe(data => this.periodes = data);

    this.anneeService.getAll()
      .subscribe(data => this.annees = data);
  }

  produire() {

    if (!this.classeecoleId || !this.periodeId || !this.anneeId) return;

    this.loading = true;

    this.noteService.getReleveClasse(
      this.ecoleId,
      this.classeecoleId,
      this.anneeId,
      this.periodeId
    ).subscribe({
      next: data => {
        this.eleves = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

imprimer() {

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logo = 'assets/logo.png';
  doc.addImage(logo, 'PNG', 15, 10, 25, 25);

  // TITRE

  doc.setFontSize(9);

  doc.text(this.etabliss.toUpperCase(), pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text('Relevé de note', pageWidth / 2, 22, { align: 'center' });

  const classeNom = this.classes.find(c => c.id == this.classeecoleId)?.nom;
  const periodeNom = this.periodes.find(p => p.id == this.periodeId)?.libelle;
  const anneeNom = this.annees.find(a => a.id == this.anneeId)?.nom;

  doc.setFontSize(10);
  doc.text(
    `Classe : ${classeNom} - Période : ${periodeNom} - Année : ${anneeNom}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );

  // TABLEAU

  const tableData = this.eleves.map((e, index) => [
    index + 1,
    e.matricule,
    e.nom,
    e.prenom,
    e.noteClasse ?? '',
    e.noteCompo ?? ''
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['N', 'Matricule', 'Nom', 'Prénom', 'Note classe', 'Note Compo']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,

      valign: 'middle'
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 0,
      fontStyle: 'bold'
    },
    didDrawPage: function (data) {

      const date = new Date();
      const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

      doc.setFontSize(9);
      doc.text(
        `Date : ${dateString}`,
        14,
        pageHeight - 10
      );


      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      const totalPages = doc.getNumberOfPages();

      doc.text(
        `Page ${pageNumber} / ${totalPages}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: 'right' }
      );
    }
  });

  doc.save('releve_classe.pdf');
}

}
