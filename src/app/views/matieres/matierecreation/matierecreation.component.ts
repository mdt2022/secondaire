import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatiereService } from '../../../service/matiere.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matierecreation',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './matierecreation.component.html',
  styleUrls: ['./matierecreation.component.scss']
})
export class MatierecreationComponent implements OnInit {
  matiereForm!: FormGroup;
  matiereId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.matiereForm = this.fb.group({
      libelle: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0)]],
      horaire: ['', [Validators.required, Validators.min(0)]],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.matiereId = +idParam;
      this.isEditMode = true;
      this.loadMatiere(this.matiereId);
    }
  }

  loadMatiere(id: number): void {
    this.matiereService.getMatiereById(id).subscribe({
      next: (matiere) => this.matiereForm.patchValue(matiere),
      error: (err) => console.error("Erreur lors du chargement de la matière", err)
    });
  }

  onSubmit(): void {
    if (this.matiereForm.valid) {
      const matiere = this.matiereForm.value;

      if (this.isEditMode && this.matiereId != null) {
        this.matiereService.updateMatiere(this.matiereId, matiere).subscribe({
          next: () => this.router.navigate(['/matieres/matieres']),
          error: (err) => console.error("Erreur lors de la mise à jour", err)
        });
      } else {
        this.matiereService.createMatiere(matiere).subscribe({
          next: () => this.router.navigate(['/matieres/matieres']),
          error: (err) => console.error("Erreur lors de la création", err)
        });
      }
    }
  }
}

