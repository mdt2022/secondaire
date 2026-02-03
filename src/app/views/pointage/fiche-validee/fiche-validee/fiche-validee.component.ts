// Installer     npm install jspdf jspdf-autotable
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PointageService } from '../../../../service/pointage.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-fiche-validee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fiche-validee.component.html',
  styleUrls: ['./fiche-validee.component.scss']
})
export class FicheValideeComponent implements OnInit {
  selectedEcoleId?: number;
  selectedEnseignantId?: number;
  dateDebut: string;
  dateFin: string;

  ficheValidee: any[] = [];
  filteredFiche: any[] = [];
  displayedFiche: any[] = [];

  montantTotal = 0;
  montantTotalFiltered = 0;
  avance = 0;
  montantNet = 0;
  montantNetFiltered = 0;

  isLoading = false;

  currentPage = 1;
  pageSize = 3;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchQuery = '';
  selectedStatus = 'all';
  filterDateStart: string = '';
  filterDateEnd: string = '';
  selectedDay: string = '';

  constructor(
    private pointageService: PointageService,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    this.dateDebut = this.formatDate(today);
    this.dateFin = this.formatDate(today);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedEcoleId = params['ecoleId'] ? +params['ecoleId'] : undefined;
      this.selectedEnseignantId = params['enseignantId'] ? +params['enseignantId'] : undefined;
      this.dateDebut = params['dateDebut'] || this.dateDebut;
      this.dateFin = params['dateFin'] || this.dateFin;

      if (this.selectedEnseignantId && this.dateDebut && this.dateFin) {
        this.loadFicheValidee();
      }
    });
  }

  loadFicheValidee(): void {
    this.isLoading = true;
    const recherche = {
      ecoleId: this.selectedEcoleId,
      enseignantId: this.selectedEnseignantId,
      dateDebut: this.parseDateForApi(this.dateDebut),
      dateFin: this.parseDateForApi(this.dateFin)
    };

    this.pointageService.rechercher(recherche).subscribe({
      next: (data) => {
        this.ficheValidee = data;
        this.applyFilters();
        this.calculerTotaux();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  onFilterChange(): void {
    this.applyFilters();
    this.currentPage = 1;
  }

  clearStatusFilter(): void {
    this.selectedStatus = 'all';
    this.onFilterChange();
  }

  onDateFilterChange(): void {

    if (this.filterDateStart && this.filterDateEnd) {
      const start = new Date(this.filterDateStart);
      const end = new Date(this.filterDateEnd);
      if (start > end) {
        this.filterDateEnd = '';
        alert('La date de fin doit être postérieure à la date de début');
      }
    }
    this.applyFilters();
    this.currentPage = 1;
  }

  clearFilterDate(type: 'start' | 'end'): void {
    if (type === 'start') {
      this.filterDateStart = '';
    } else {
      this.filterDateEnd = '';
    }
    this.onDateFilterChange();
  }

  onDayFilterChange(): void {
    this.applyFilters();
    this.currentPage = 1;
  }

  clearDayFilter(): void {
    this.selectedDay = '';
    this.onDayFilterChange();
  }

  // applyQuickDateFilter(type: 'today' | 'yesterday' | 'thisWeek'): void {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   switch (type) {
  //     case 'today':
  //       const todayStr = today.toISOString().split('T')[0];
  //       this.filterDateStart = todayStr;
  //       this.filterDateEnd = todayStr;
  //       break;

  //     case 'yesterday':
  //       const yesterday = new Date(today);
  //       yesterday.setDate(yesterday.getDate() - 1);
  //       const yesterdayStr = yesterday.toISOString().split('T')[0];
  //       this.filterDateStart = yesterdayStr;
  //       this.filterDateEnd = yesterdayStr;
  //       break;

  //     case 'thisWeek':
  //       const startOfWeek = new Date(today);
  //       startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Lundi
  //       const endOfWeek = new Date(startOfWeek);
  //       endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

  //       this.filterDateStart = startOfWeek.toISOString().split('T')[0];
  //       this.filterDateEnd = endOfWeek.toISOString().split('T')[0];
  //       break;
  //   }

  //   this.onDateFilterChange();
  // }

  resetAllFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.selectedDay = '';
    this.applyFilters();
    this.currentPage = 1;
  }

  private applyFilters(): void {
    let filtered = [...this.ficheValidee];

    // Recherche textuelle
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        this.searchInItem(item, query)
      );
    }

    // Filtre par statut
    filtered = this.applyStatusFilter(filtered);

    // 3. Filtre par dates
    filtered = this.applyDateFilter(filtered);

    // 4. Filtre par jour
    // if (this.selectedDay) {
    //   filtered = filtered.filter(item =>
    //     item.emploidutemps?.jour?.toUpperCase() === this.selectedDay.toUpperCase()
    //   );
    // }

    this.filteredFiche = filtered;
    this.calculerTotauxFiltres();
    this.applySortAndPagination();
  }

  private searchInItem(item: any, query: string): boolean {
    const fields = [
      item.emploidutemps?.matiere?.libelle,
      item.emploidutemps?.classe?.nom,
      item.enseignant?.prenom,
      item.enseignant?.nom,
      item.emploidutemps?.jour,
      item.id?.toString(),
      item.datevalider,
      item.emploidutemps?.heuredebut,
      item.emploidutemps?.heurefin
    ];

    return fields.some(field =>
      field && field.toString().toLowerCase().includes(query)
    );
  }

  private applyStatusFilter(data: any[]): any[] {
    switch (this.selectedStatus) {
      case 'recent':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return data.filter(item => {
          const itemDate = this.parseDateString(item.datevalider);
          return itemDate >= sevenDaysAgo;
        });

      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return data.filter(item => {
          const itemDate = this.parseDateString(item.datevalider);
          return itemDate >= today && itemDate < tomorrow;
        });

      case 'thisWeek':
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return data.filter(item => {
          const itemDate = this.parseDateString(item.datevalider);
          return itemDate >= startOfWeek && itemDate < endOfWeek;
        });

      case 'thisMonth':
        const nowMonth = new Date();
        const startOfMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
        const endOfMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        return data.filter(item => {
          const itemDate = this.parseDateString(item.datevalider);
          return itemDate >= startOfMonth && itemDate <= endOfMonth;
        });

      default:
        return data;
    }
  }

  private applyDateFilter(data: any[]): any[] {
    let filtered = [...data];

    // Filtre par date de début
    // if (this.filterDateStart) {
    //   const startDate = new Date(this.filterDateStart);
    //   startDate.setHours(0, 0, 0, 0);
    //   filtered = filtered.filter(item => {
    //     const itemDate = this.parseDateString(item.datevalider);
    //     return itemDate >= startDate;
    //   });
    // }

    // Filtre par date de fin
    // if (this.filterDateEnd) {
    //   const endDate = new Date(this.filterDateEnd);
    //   endDate.setHours(23, 59, 59, 999);
    //   filtered = filtered.filter(item => {
    //     const itemDate = this.parseDateString(item.datevalider);
    //     return itemDate <= endDate;
    //   });
    // }

    return filtered;
  }

  hasActiveFilters(): boolean {
    return this.searchQuery !== '' ||
           this.selectedStatus !== 'all' ||
           this.filterDateStart !== '' ||
           this.filterDateEnd !== '' ||
           this.selectedDay !== '';
  }

  hasMultipleFilters(): boolean {
    let count = 0;
    if (this.searchQuery !== '') count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.filterDateStart !== '') count++;
    if (this.filterDateEnd !== '') count++;
    if (this.selectedDay !== '') count++;
    return count > 1;
  }

  getStatusLabel(status: string): string {
    const labels: {[key: string]: string} = {
      'all': 'Tous',
      'recent': '7 derniers jours',
      'today': 'Aujourd\'hui',
      'thisWeek': 'Cette semaine',
      'thisMonth': 'Ce mois'
    };
    return labels[status] || status;
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    if (dateString.includes('/')) {

      const [day, month, year] = dateString.split('/');
      return `${day}/${month}/${year}`;
    } else if (dateString.includes('-')) {

      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  private parseDateString(dateString: string): Date {
    if (!dateString) return new Date(0);

    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateString.includes('-')) {

      return new Date(dateString);
    }

    return new Date(dateString);
  }


  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applySortAndPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  //TRI
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySortAndPagination();
  }

  private applySortAndPagination(): void {
    let sorted = [...this.filteredFiche];

    if (this.sortColumn) {
      sorted.sort((a: any, b: any) => {
        const valA = this.getNestedValue(a, this.sortColumn);
        const valB = this.getNestedValue(b, this.sortColumn);

        if (valA == null && valB == null) return 0;
        if (valA == null) return this.sortDirection === 'asc' ? 1 : -1;
        if (valB == null) return this.sortDirection === 'asc' ? -1 : 1;


        if (this.sortColumn.includes('date') || this.sortColumn === 'datevalider') {
          const dateA = this.parseDateString(valA);
          const dateB = this.parseDateString(valB);
          return this.sortDirection === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalPages = Math.max(1, Math.ceil(sorted.length / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, sorted.length);
    this.displayedFiche = sorted.slice(startIndex, endIndex);
  }


  private calculerTotaux(): void {
    this.montantTotal = this.ficheValidee.reduce((total, item) => {
      const tarif = item.enseignant?.tarif || 0;
      const horaire = item.emploidutemps?.matiere?.horaire || 0;
      return total + (tarif * horaire);
    }, 0);

    this.avance = this.calculerAvance();
    this.montantNet = Math.max(0, this.montantTotal - this.avance);
  }

  private calculerTotauxFiltres(): void {
    this.montantTotalFiltered = this.filteredFiche.reduce((total, item) => {
      const tarif = item.enseignant?.tarif || 0;
      const horaire = item.emploidutemps?.matiere?.horaire || 0;
      return total + (tarif * horaire);
    }, 0);

    this.montantNetFiltered = Math.max(0, this.montantTotalFiltered - this.avance);
  }

  private calculerAvance(): number {
    return 0;
  }


  deletePointage(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pointage ? Cette action est irréversible.')) {
      this.pointageService.delete(id).subscribe({
        next: () => this.loadFicheValidee(),
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression du pointage.');
        }
      });
    }
  }

imprimerFichePaiement() {

  if (!this.filteredFiche.length) {
    alert('Aucune donnée à imprimer');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const logo = new Image();
  logo.src = 'assets/logo.png';

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  logo.onload = () => {

    const nomEcole = user?.administrateur?.ecole?.descriptionEcole || '';
    const adresseEcole = user?.administrateur?.ecole?.adresseEcole || '';

    const enseignant = this.filteredFiche[0]?.enseignant;
    const nomComplet = `${enseignant?.prenom || ''} ${enseignant?.nom || ''}`;

    doc.addImage(logo, 'PNG', 15, 10, 25, 25);

    doc.setFontSize(10);
    doc.text(nomEcole, 60, 18);

    doc.setFontSize(12);

    doc.text('FICHE DE PAIEMENT ENSEIGNANT', 65, 47);

    doc.setFontSize(11);
    doc.text(`Période : du ${this.dateDebut} au ${this.dateFin}`, 15, 60);

    doc.text(`Enseignant : ${nomComplet}`, 15, 66);

    let totalNH = 0;
    let totalMontant = 0;

    const rows: any[] = [];

    this.filteredFiche.forEach(p => {

      const nh = p.emploidutemps?.matiere?.horaire || 0;
      const montant = (p.enseignant?.tarif || 0) * nh;

      totalNH += nh;
      totalMontant += montant;

      rows.push([
        p.emploidutemps?.jour,
        p.emploidutemps?.matiere?.libelle,
        p.emploidutemps?.classe?.nom,
        `${p.emploidutemps?.heuredebut} - ${p.emploidutemps?.heurefin}`,
        nh,
        montant
      ]);
    });

    rows.push([
      '', '', '', 'TOTAL',
      totalNH,
      totalMontant
    ]);

    autoTable(doc, {
      startY: 72,
      head: [[ 'Jour','Matière','Classe','Heure','NH','Montant' ]],
      body: rows,
      styles: { fontSize: 9, halign: 'center', lineWidth: 0.3 },
      headStyles: { fillColor: [255,255,255], textColor: 0, lineWidth: 0.5 },
      theme: 'grid',
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.text(adresseEcole, 15, pageHeight - 10);
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    const today = new Date().toLocaleDateString('fr-FR');
    doc.text(`Fait le : ${today}`, 15, finalY);

    doc.text('Emargement : _____________________', 130, finalY);

    doc.save(`fiche_paiement_${this.dateDebut}_${this.dateFin}.pdf`);
  };
}


  private getNestedValue(obj: any, path: string): any {
    if (!obj) return '';
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseDateForApi(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
}
