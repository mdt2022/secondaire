import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ClasseEcole } from '../../model/classeecole';
import { Classe } from '../../model/classe';
import { Ecole } from '../../model/ecole';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { ClasseService } from '../../service/classe.service';
import { EcoleService } from '../../service/ecole.service';

@Component({
  selector: 'app-classeecole',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './classeecole.component.html',
  styleUrls: ['./classeecole.component.scss']
})
export class ClasseecoleComponent implements OnInit {

  classeEcoles: ClasseEcole[] = [];
  classes: Classe[] = [];
  ecoles: Ecole[] = [];
  form!: FormGroup;
  editMode = false;
  currentId?: number;

  // Pour filtrage et tri
  filterText = '';
  sortColumn = 'classe';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  page = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private classeEcoleService: ClasseEcoleService,
    private classeService: ClasseService,
    private ecoleService: EcoleService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      classe: ['', Validators.required],
      ecole: ['', Validators.required]
    });
    this.loadData();
  }

  loadData(): void {
    this.classeEcoleService.getAll().subscribe(data => this.classeEcoles = data);
    this.classeService.getAll().subscribe(data => this.classes = data);
    this.ecoleService.getAll().subscribe(data => this.ecoles = data);
  }

  // Tri simple
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  filteredClasseEcoles(): ClasseEcole[] {
    let list = this.classeEcoles;

    // Filtre avec protection contre null
    if (this.filterText) {
      const ft = this.filterText.toLowerCase();
      list = list.filter(c =>
        (c.classe?.nom?.toLowerCase() || '').includes(ft) ||
        (c.ecole?.nomEcole?.toLowerCase() || '').includes(ft)
      );
    }

    // Tri avec protection contre null
    list.sort((a, b) => {
      const valA = this.sortColumn === 'classe' ? (a.classe?.nom || '') : (a.ecole?.nomEcole || '');
      const valB = this.sortColumn === 'classe' ? (b.classe?.nom || '') : (b.ecole?.nomEcole || '');
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }

  totalPages(): number {
    return Math.ceil(this.filteredClasseEcoles().length / this.pageSize);
  }

  prevPage(): void { if (this.page > 1) this.page--; }
  nextPage(): void { if (this.page < this.totalPages()) this.page++; }

  save(): void {
    const selectedClasse = this.classes.find(c => c.id == this.form.value.classe);
    const selectedEcole = this.ecoles.find(e => e.idEcole == this.form.value.ecole);

    if (!selectedClasse || !selectedEcole) return;

    // Vérifier doublon
    const exists = this.classeEcoles.some(ce =>
      ce.classe.id === selectedClasse.id && ce.ecole.idEcole === selectedEcole.idEcole
    );
    if (exists && !this.editMode) {
      Swal.fire('Erreur', 'Cette classe est déjà affectée à cette école !', 'error');
      return;
    }

    const ce: ClasseEcole = { classe: selectedClasse, ecole: selectedEcole };

    if (this.editMode && this.currentId) {
      this.classeEcoleService.update(this.currentId, ce).subscribe(() => {
        Swal.fire('Modifié !', 'Association mise à jour avec succès', 'success');
        this.loadData();
        this.resetForm();
      }, error => Swal.fire('Erreur', error.error.message || error.message, 'error'));
    } else {
      this.classeEcoleService.create(ce).subscribe(() => {
        Swal.fire('Ajouté !', 'Association créée avec succès', 'success');
        this.loadData();
        this.resetForm();
      }, error => Swal.fire('Erreur', error.error.message || error.message, 'error'));
    }
  }

  edit(ce: ClasseEcole): void {
    this.editMode = true;
    this.currentId = ce.id;
    this.form.patchValue({
      classe: ce.classe.id,
      ecole: ce.ecole.idEcole
    });
  }

  confirmDelete(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Voulez-vous vraiment supprimer cette association ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.classeEcoleService.delete(id).subscribe(() => {
          Swal.fire('Supprimé !', 'Association supprimée.', 'success');
          this.loadData();
        });
      }
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.currentId = undefined;
    this.form.reset();
  }
}
