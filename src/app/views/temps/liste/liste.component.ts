import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AuthService } from '../../../service/auth.service';
import { Emploidutemps } from '../../../model/emploidutemps';
import { User } from '../../../model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './liste.component.html'
})
export class ListeComponent implements OnInit {

  emplois: Emploidutemps[] = [];
  filteredEmplois: Emploidutemps[] = [];
  pagedEmplois: Emploidutemps[] = [];

  page = 1;
  pageSize = 10;
  totalPages = 1;
  searchTerm = '';
  sortColumn: 'jour' | 'matiere' | 'enseignant' | 'classe' | 'heuredebut' | 'heurefin' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  user!: User;
  selectedEmploi?: Emploidutemps;

  constructor(
    private router: Router,
    private emploiService: EmploidutempsService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.loadEmplois();
  }

  loadEmplois(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;
    this.emploiService.parAnneeAndEcole(
      this.user.parametre.anneepardefaut.id, this.user.administrateur.ecole.idEcole
    ).subscribe(data => {
      this.emplois = data.filter(e => e.ecole?.idEcole === idEcole)
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const term = (this.searchTerm || '').toLowerCase();
    this.filteredEmplois = this.emplois.filter(e =>
      (e.matiere?.libelle || '').toLowerCase().includes(term) ||
      (e.classe?.nom || '').toLowerCase().includes(term) ||
      (e.professeur?.nom || '').toLowerCase().includes(term) ||
      (e.professeur?.prenom || '').toLowerCase().includes(term)
    );
    if (this.sortColumn) {
      this.filteredEmplois.sort((a, b) => {
        const valueA = this.getSortValue(a, this.sortColumn);
        const valueB = this.getSortValue(b, this.sortColumn);
        const result = valueA.localeCompare(valueB, 'fr', { numeric: true, sensitivity: 'base' });
        return this.sortDirection === 'asc' ? result : -result;
      });
    }
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredEmplois.length / this.pageSize);
    this.updatePage();
  }

  sort(column: NonNullable<typeof this.sortColumn>): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  private getSortValue(emploi: Emploidutemps, column: NonNullable<typeof this.sortColumn>): string {
    switch (column) {
      case 'jour':
        return emploi.jour || '';
      case 'matiere':
        return emploi.matiere?.libelle || '';
      case 'enseignant':
        return `${emploi.professeur?.prenom || ''} ${emploi.professeur?.nom || ''}`.trim();
      case 'classe':
        return emploi.classe?.nom || '';
      case 'heuredebut':
        return emploi.heuredebut || '';
      case 'heurefin':
        return emploi.heurefin || '';
    }
    return '';
  }

  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEmplois = this.filteredEmplois.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  goToNew(): void {
    this.router.navigate(['../new'], { relativeTo: this.route });
  }

  edit(e: Emploidutemps): void {
    this.router.navigate(['../new'], { relativeTo: this.route, state: { emploi: e } });
  }


  delete(id: number): void {
    Swal.fire({
      title: 'Supprimer cet emploi du temps ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.emploiService.delete(id).subscribe({
        next: () => {
          this.emplois = this.emplois.filter(e => e.id !== id);
          this.applyFilter();
          Swal.fire('Supprimé', 'L’emploi du temps a été supprimé.', 'success');
        },
        error: (err) => {
          console.error('Erreur suppression :', err);
          Swal.fire('Erreur', 'Impossible de supprimer cet emploi du temps.', 'error');
        }
      });
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value || '';
    this.applyFilter();
  }

  showDetails(e: Emploidutemps): void {
    this.selectedEmploi = e;
  }

  backToList(): void {
    this.router.navigate(['../liste'], { relativeTo: this.route });
  }
}
