import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EnseignantService } from '../../../service/enseignant.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { Enseignant } from '../../../model/enseignant';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';
@Component({
  selector: 'app-semaine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './semaine.component.html',
  styleUrls: ['./semaine.component.scss']
})
export class SemaineComponent implements OnInit {
  emploiForm!: FormGroup;
  enseignants: Enseignant[] = [];
  annees: Anneeuv[] = [];
  emploisTable: Emploidutemps[] = [];
  loading = false;
  idEcole!: number;
  page = 1;
  pageSize = 5;
  totalPages = 0;
  paginatedData: Emploidutemps[] = [];
  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.getEcoleFromUser();
    this.loadEnseignantsParEcole();
    this.loadAnnees();
  }
  getEcoleFromUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.idEcole =
      user?.parametre?.ecole?.idEcole ||
      user?.administrateur?.ecole?.idEcole;

    if (!this.idEcole) {
      console.error('ID école introuvable');
    }
  }
  initForm(): void {
    this.emploiForm = this.fb.group({
      professeur: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });
  }
  loadEnseignantsParEcole(): void {
    if (!this.idEcole) return;
    this.enseignantService.getEnseignantEcole(this.idEcole).subscribe({
      next: data => this.enseignants = data,
      error: err => console.error(err)
    });
  }
  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error(err)
    });
  }
  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      return;
    }
    const { professeur, anneeuv } = this.emploiForm.value;
    this.loading = true;
    this.emploiService.getAll().subscribe({
      next: data => {
        this.emploisTable = data.filter(e =>
          e.professeur?.id === professeur &&
          e.anneeuv?.id === anneeuv &&
          e.ecole?.idEcole === this.idEcole
        );
        this.page = 1;
        this.updatePagination();
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  calculHeures(debut?: string, fin?: string): number {
    if (!debut || !fin) return 0;
    const d1 = new Date(`1970-01-01T${debut}`);
    const d2 = new Date(`1970-01-01T${fin}`);
    return Math.max((d2.getTime() - d1.getTime()) / 3600000, 0);
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.emploisTable.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.emploisTable.slice(start, end);
  }
  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.updatePagination();
  }
  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
