import { Component, OnInit } from '@angular/core';
import { Enseigner } from '../../model/enseigner';
import { EnseignerService } from '../../service/enseigner.service';
import { EnseignantService } from '../../service/enseignant.service';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { MatiereService } from '../../service/matiere.service';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-enseigner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './enseigner.component.html',
  styleUrls: ['./enseigner.component.scss']
})
export class EnseignerComponent implements OnInit {

  viewMode: 'list' | 'create' | 'edit' = 'list';
  enseignants: Enseigner[] = [];
  filteredData: Enseigner[] = [];
  pagedData: Enseigner[] = [];

  classes: any[] = [];
  matieres: any[] = [];
  professeurs: any[] = [];

  selectedEnseigner: Enseigner | null = null;

  searchText = '';
  filterClasseId: number | null = null;
  filterMatiereId: number | null = null;
  filterProfesseurId: number | null = null;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 0;
  size = 10;
  totalPages = 0;

  selectedProfesseurId: number | null = null;
  nombreClasse = 0;
  affectations: { classeId: number | null; matieres: number[] }[] = [];

  constructor(
    private enseignerService: EnseignerService,
    private enseignantService: EnseignantService,
    private classeService: ClasseEcoleService,
    private matiereService: MatiereService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadList();
    this.loadProfesseurs();
    this.loadClasses();
    this.loadMatieres();
  }

  /*  LOAD DATA  */
  loadList(): void {
    const ecoleId = this.auth.getAdminData().administrateur.ecole.idEcole;
    this.enseignerService.getAllForEcole(ecoleId).subscribe({
      next: data => {
        this.enseignants = data;
        this.applyAll();
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger la liste', 'error')
    });
  }

  loadProfesseurs(): void {
    const ecoleId = this.auth.getAdminData().administrateur.ecole.idEcole;
    this.enseignantService.getEnseignantEcole(ecoleId).subscribe({
      next: data => this.professeurs = data,
      error: () => Swal.fire('Erreur', 'Impossible de charger les enseignants', 'error')
    });
  }

  loadClasses(): void {
    const ecoleId = this.auth.getAdminData().administrateur.ecole.idEcole;
    this.classeService.getAllClasseParEcole(ecoleId).subscribe({
      next: data => this.classes = data,
      error: () => Swal.fire('Erreur', 'Impossible de charger les classes', 'error')
    });
  }

  loadMatieres(): void {
    this.matiereService.getAll().subscribe({
      next: data => this.matieres = data,
      error: () => Swal.fire('Erreur', 'Impossible de charger les matières', 'error')
    });
  }

  /*  FILTRE + TRI + PAGINATION  */
  applyAll(): void {
    this.applyFilter();
    this.applySort();
    this.applyPagination();
  }

  applyFilter(): void {
    const txt = this.searchText.toLowerCase();
    this.filteredData = this.enseignants.filter(e =>
      (!this.filterClasseId || e.classe?.id === this.filterClasseId) &&
      (!this.filterMatiereId || e.matiere?.id === this.filterMatiereId) &&
      (!this.filterProfesseurId || e.enseignant?.id === this.filterProfesseurId) &&
      (!txt ||
        e.classe?.nom?.toLowerCase().includes(txt) ||
        e.matiere?.libelle?.toLowerCase().includes(txt) ||
        `${e.enseignant?.prenom ?? ''} ${e.enseignant?.nom ?? ''}`.toLowerCase().includes(txt)
      )
    );
    this.page = 0;
  }

  resetFilter(): void {
    this.searchText = '';
    this.filterClasseId = null;
    this.filterMatiereId = null;
    this.filterProfesseurId = null;
    this.applyAll();
  }

  sort(col: string): void {
    if (this.sortColumn === col) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else { this.sortColumn = col; this.sortDirection = 'asc'; }
    this.applySort();
    this.applyPagination();
  }

  applySort(): void {
    if (!this.sortColumn) return;
    this.filteredData.sort((a, b) => {
      const v1 = this.resolve(a, this.sortColumn);
      const v2 = this.resolve(b, this.sortColumn);
      return v1 < v2 ? (this.sortDirection === 'asc' ? -1 : 1) : v1 > v2 ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  resolve(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  applyPagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.size);
    const start = this.page * this.size;
    this.pagedData = this.filteredData.slice(start, start + this.size);
  }

  nextPage(): void { if (this.page + 1 < this.totalPages) { this.page++; this.applyPagination(); } }
  prevPage(): void { if (this.page > 0) { this.page--; this.applyPagination(); } }

  /*  CRUD  */
  switchView(v: 'list' | 'create' | 'edit'): void { this.viewMode = v; }

  edit(e: Enseigner): void {
    this.selectedEnseigner = JSON.parse(JSON.stringify(e));
    this.viewMode = 'edit';
  }

  update(): void {
    if (!this.selectedEnseigner) return;
    this.enseignerService.update(this.selectedEnseigner.id, this.selectedEnseigner).subscribe(() => {
      Swal.fire('Succès', 'Modification enregistrée', 'success');
      this.viewMode = 'list';
      this.loadList();
    });
  }

  delete(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(res => {
      if (res.isConfirmed) {
        this.enseignerService.delete(id).subscribe(() => {
          Swal.fire('Supprimé', 'Enregistrement supprimé', 'success');
          this.loadList();
        });
      }
    });
  }

  /*  CREATE  */
  generateAffectations(): void {
    if (!this.nombreClasse || !this.selectedProfesseurId) {
      Swal.fire('Erreur', 'Sélectionnez un professeur et un nombre de classes', 'error');
      return;
    }
    this.affectations = Array.from({ length: this.nombreClasse }, () => ({ classeId: null, matieres: [] }));
  }

  onMatiereToggle(event: Event, affectation: any, matiereId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) affectation.matieres.push(matiereId);
    else {
      const idx = affectation.matieres.indexOf(matiereId);
      if (idx !== -1) affectation.matieres.splice(idx, 1);
    }
  }

saveAffectations(): void {
  if (!this.selectedProfesseurId) {
    Swal.fire('Erreur', 'Sélectionnez un professeur', 'error');
    return;
  }

  const ecoleId = Number(this.auth.getAdminData().administrateur.ecole.idEcole);
  const anneeuvId = Number(this.auth.getAdminData().parametre.anneepardefaut.id);

  const payload: Enseigner[] = [];

  this.affectations.forEach(a => {
    if (!a.classeId || !a.matieres.length) return;

    a.matieres.forEach(mid => {
      payload.push({
        classe: { id: Number(a.classeId) },
        matiere: { id: Number(mid) },
        enseignant: { id: Number(this.selectedProfesseurId) },
        ecole: { idEcole: ecoleId },
        anneeuv: { id: anneeuvId }
      } as Enseigner);
    });
  });

  if (!payload.length) {
    Swal.fire('Erreur', 'Veuillez remplir toutes les affectations', 'error');
    return;
  }

  console.log('Payload Enseigner:', payload); 

  Promise.all(payload.map(e =>
    this.enseignerService.create(e).toPromise()
  ))
    .then(() => {
      Swal.fire('Succès', 'Affectations enregistrées', 'success');
      this.viewMode = 'list';
      this.loadList();
    })
    .catch(err => {
      console.error('Erreur création Enseigner:', err);
      Swal.fire('Erreur', err?.error || 'Impossible d’enregistrer', 'error');
    });
}
}