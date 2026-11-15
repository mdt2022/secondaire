import { Component, OnInit } from '@angular/core';
import { PointageService } from '../../../../service/pointage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../../../../service/auth.service';
import {User} from '../../../../model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-honoraires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './honoraires.component.html',
  styleUrls: ['./honoraires.component.scss']
})
export class HonorairesComponent implements OnInit {
  dateDebut: string;
  dateFin: string;
  honoraires: any;
  ecoleId: number | null = null;
  totalMontant: number = 0;
  totalAvances: number = 0;
  isLoading: boolean = false;

 user: User | null = null;
 
  // Pagination et tri
  page: number = 1;
  pageSize: number = 5;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private pointageService: PointageService, private authService: AuthService) {
    const today = new Date();
    this.dateDebut = this.formatDateManuelle(today);
    this.dateFin = this.formatDateManuelle(today);
  }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.ecoleId = this.authService.getEcoleId();
    const navigationState = (window.history.state ?? {}) as {
      dateDebut?: unknown;
      dateFin?: unknown;
    };
    if (typeof navigationState.dateDebut === 'string' && typeof navigationState.dateFin === 'string') {
      this.dateDebut = navigationState.dateDebut;
      this.dateFin = navigationState.dateFin;
    }

    if (!this.ecoleId) {
      Swal.fire('Établissement introuvable', 'Impossible d’identifier l’établissement de l’utilisateur.', 'error');
      return;
    }
    this.calculerHonoraires();
  }

  
calculerHonoraires(): void {
  if (!this.validateDates()) return;
  if (!this.ecoleId) {
    Swal.fire('Établissement introuvable', 'Impossible d’identifier l’établissement de l’utilisateur.', 'error');
    return;
  }

  this.isLoading = true;
  this.pointageService.calculerHonoraires(this.ecoleId, this.dateDebut, this.dateFin).subscribe({
    next: (data) => {
      this.honoraires = data;
      this.totalMontant = data.totalMontant || 0;
      this.totalAvances = data.totalAvances || 0;
      this.page = 1; 
      this.isLoading = false; 
    },
    error: (error) => {
      console.error('Erreur lors du calcul des honoraires:', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors du calcul des honoraires.', 'error');
      this.isLoading = false; 
    }
  });
}

  
  get paginatedDetails(): any[] {
    if (!this.honoraires?.details) return [];
    let data = [...this.honoraires.details];

    // Tri
    if (this.sortColumn) {
      data.sort((a, b) => {
        const valA = a[this.sortColumn] ?? '';
        const valB = b[this.sortColumn] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return this.sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // Pagination
    const start = (this.page - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    if (!this.honoraires?.details) return 1;
    return Math.ceil(this.honoraires.details.length / this.pageSize);
  }

  changePage(delta: number): void {
    const next = this.page + delta;
    if (next >= 1 && next <= this.totalPages) this.page = next;
  }

 
  // Tri par colonne
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

 

imprimerPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');

  const logo = new Image();
  logo.src = 'assets/logo.png';

  const user = this.user;

  const nomEcole =
    user?.administrateur?.ecole?.descriptionEcole || 'Nom de l\'école';

  const adresseEcole =
    user?.administrateur?.ecole?.adresseEcole || 'Adresse non disponible';

  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(Number(montant || 0)).replace(/[\u202f\u00a0]/g, ' ');
  };

  const genererPDF = (logoCharge: boolean) => {

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // LOGO
    if (logoCharge) {
      doc.addImage(logo, 'PNG', 15, 10, 25, 25);
    }

    // NOM DE L'ÉCOLE
    const nomX = logoCharge ? 45 : 15;
    const largeurTexte = logoCharge ? 150 : 180;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const nomLines = doc.splitTextToSize(nomEcole, largeurTexte);
    doc.text(nomLines, nomX, 17);

    // ADRESSE DE L'ÉCOLE
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const adresseLines = doc.splitTextToSize(adresseEcole, largeurTexte);

    const adresseY = 17 + nomLines.length * 5 + 2;
    doc.text(adresseLines, nomX, adresseY);

    // LIGNE DE SÉPARATION
    const ligneY = Math.max(
      36,
      adresseY + adresseLines.length * 4 + 3
    );

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(15, ligneY, pageWidth - 15, ligneY);

    // TITRE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(
      'ETAT DES HONORAIRES DES PROFESSEURS',
      pageWidth / 2,
      ligneY + 12,
      { align: 'center' }
    );

    // PÉRIODE
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(
      `Mois : Du ${this.dateDebut} au ${this.dateFin}`,
      15,
      ligneY + 23
    );

    // DONNÉES DU TABLEAU
    const rows: any[] = [];

    this.honoraires.details.forEach((r: any) => {
      rows.push([
        r.enseignantPrenom || '',
        r.enseignantNom || '',
        r.totalHeures || 0,
        formatMontant(r.montantBrut),
        formatMontant(r.avance),
        formatMontant(r.montantNet),
        ''
      ]);
    });

    // TABLEAU
    autoTable(doc, {
      startY: ligneY + 28,

      margin: {
        left: 15,
        right: 15,
        bottom: 22
      },

      head: [[
        'Prénom',
        'Nom',
        'Heures',
        'Montant brut',
        'Avance',
        'Montant Net',
        'Emargement'
      ]],

      body: rows,

      theme: 'grid',

      styles: {
        font: 'helvetica',
        fontSize: 9,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
        halign: 'center',
        valign: 'middle',
        minCellHeight: 10
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'center'
      },

      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },

      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 30 },
        2: { cellWidth: 15 },
        3: { cellWidth: 28 },
        4: { cellWidth: 20 },
        5: { cellWidth: 28 },
        6: { cellWidth: 25 }
      },

      didDrawPage: () => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);

        doc.line(
          15,
          pageHeight - 15,
          pageWidth - 15,
          pageHeight - 15
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);

        doc.text(adresseEcole, 15, pageHeight - 9, {
          maxWidth: 150
        });

        doc.text(
          `Page ${doc.getCurrentPageInfo().pageNumber}`,
          pageWidth - 15,
          pageHeight - 9,
          { align: 'right' }
        );
      }
    });

    // RÉCAPITULATIF
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    if (finalY + 42 > pageHeight - 18) {
      doc.addPage();
      finalY = 20;
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);

    doc.rect(15, finalY, 180, 34);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text('RECAPITULATIF DES HONORAIRES', 20, finalY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    doc.text('Montant total :', 20, finalY + 15);
    doc.text(
      `${formatMontant(this.totalMontant)} FCFA`,
      190,
      finalY + 15,
      { align: 'right' }
    );

    doc.text('Montant des avances :', 20, finalY + 22);
    doc.text(
      `${formatMontant(this.totalAvances)} FCFA`,
      190,
      finalY + 22,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'bold');

    doc.text('Montant Net :', 20, finalY + 30);
    doc.text(
      `${formatMontant(this.totalMontant - this.totalAvances)} FCFA`,
      190,
      finalY + 30,
      { align: 'right' }
    );

    // SIGNATURES
    finalY += 45;

    if (finalY + 25 > pageHeight - 18) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);

    doc.text('Le responsable de la scolarité', 25, finalY);
    doc.text('La Direction', 145, finalY);

    doc.setLineWidth(0.3);
    doc.line(20, finalY + 22, 85, finalY + 22);
    doc.line(130, finalY + 22, 190, finalY + 22);

    // EXPORTATION
    doc.save(
      `honoraires_${this.dateDebut}_${this.dateFin}.pdf`
    );
  };

  // CHARGEMENT DU LOGO
  logo.onload = () => genererPDF(true);
  logo.onerror = () => genererPDF(false);
}




  private formatDateManuelle(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  validateDates(): boolean {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(this.dateDebut) || !dateRegex.test(this.dateFin)) {
      Swal.fire('Dates invalides', 'Veuillez entrer des dates valides au format JJ/MM/AAAA.', 'warning');
      return false;
    }
    return true;
  }

  onCalculateClick(): void {
  if (this.validateDates()) {
    this.isLoading = true;
    this.calculerHonoraires();
  }
}
}
