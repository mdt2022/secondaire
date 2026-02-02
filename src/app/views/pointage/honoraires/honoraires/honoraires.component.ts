import { Component, OnInit } from '@angular/core';
import { PointageService } from '../../../../service/pointage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../../../../service/auth.service';
import {User} from '../../../../model/user';

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
    this.calculerHonoraires();
  }

  
calculerHonoraires(): void {
  if (!this.validateDates()) return;

  this.pointageService.calculerHonoraires(this.dateDebut, this.dateFin).subscribe({
    next: (data) => {
      this.honoraires = data;
      this.totalMontant = data.totalMontant || 0;
      this.totalAvances = data.totalAvances || 0;
      this.page = 1; 
      this.isLoading = false; 
    },
    error: (error) => {
      console.error('Erreur lors du calcul des honoraires:', error);
      alert('Une erreur est survenue lors du calcul des honoraires');
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
  logo.onload = () => {
   
    const nomEcole = user?.administrateur?.ecole?.descriptionEcole || 'Nom de l\'école';
    const adresseEcole = user?.administrateur?.ecole?.adresseEcole || 'Adresse non disponible';

   
    doc.addImage(logo, 'PNG', 15, 10, 25, 25);

    doc.setFontSize(9);
    doc.text(nomEcole, 60, 18);

    doc.setFontSize(12);
    doc.setFillColor(200, 225, 255);
    doc.rect(15, 40, 180, 10, 'F');
    doc.text('ETAT DES HONORAIRES DES PROFESSEURS', 60, 47);

    doc.setFontSize(11);
    doc.text(`Mois : Du ${this.dateDebut} au ${this.dateFin}`, 15, 60);

    const rows: any[] = [];
    this.honoraires.details.forEach((r: any) => {
      rows.push([
        r.enseignantPrenom,
        r.enseignantNom,
        r.totalHeures,
        r.montantBrut,
        r.avance,
        r.montantNet,
        ''
      ]);
    });

    autoTable(doc, {
      startY: 65,
      head: [[
        'Prénom', 'Nom', 'Heures', 'Montant brut', 'Avance', 'Montant Net', 'Emargement'
      ]],
      body: rows,
      styles: { fontSize: 9, halign: 'center', valign: 'middle', lineColor: [0,0,0], lineWidth: 0.3 },
      headStyles: { fillColor: [255,255,255], textColor: 0, lineColor: [0,0,0], lineWidth: 0.5, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 30 },
        2: { cellWidth: 15 },
        3: { cellWidth: 28 },
        4: { cellWidth: 20 },
        5: { cellWidth: 28 },
        6: { cellWidth: 25 }
      },
      theme: 'grid',
      didDrawPage: (data) => {
        
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.text(`${adresseEcole}`, 15, pageHeight - 10);
        doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 180, pageHeight - 10, { align: 'right' });
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Montant total : ${this.totalMontant} FCFA`, 15, finalY);
    doc.text(`Avances : ${this.totalAvances} FCFA`, 15, finalY + 6);
    doc.text(`Montant Net : ${this.totalMontant - this.totalAvances} FCFA`, 15, finalY + 12);

    doc.save(`honoraires_${this.dateDebut}_${this.dateFin}.pdf`);
  };
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
      alert('Veuillez entrer des dates valides au format JJ/MM/AAAA');
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
